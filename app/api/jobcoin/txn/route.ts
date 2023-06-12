import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js"; 
import { User } from '@/lib/types';
import { getUser } from '@/lib';

const supabaseUrl:string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'default'
const supabaseKey:string = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? 'default'

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const userAddress = req.headers.get("address")
    let { data, error } = await supabase.from("Transactions").select().eq("from",userAddress)
    
    if (error) {
      return NextResponse.json({ message: error.message,status:401})
    }
    return NextResponse.json({ data, status: 204 })
  } catch (e) {
    return NextResponse.json({error:e, status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
    try {
      const txn = await req.json()
      let { data:txnData, error:txnError } = await supabase.from("Transactions").insert([txn]).select()
      if (txnError) {
        return NextResponse.error()
      }
      const userFrom= await getUser({headers:{ "address": txn.from }})
      const userTo= await getUser({headers:{ "address": txn.to }})
      const fromBalance:number = userFrom[0].balance-txn.amount
      const toBalance:number = userTo[0].balance+txn.amount
      let { error:balanceUpdateError1 } = await supabase.from("Users").update({"balance":fromBalance}).eq("address",txn.from)
      let { error:balanceUpdateError2 } = await supabase.from("Users").update({"balance":toBalance}).eq("address",txn.to)
      if (balanceUpdateError1 || balanceUpdateError2) {
        return NextResponse.error()
      }
      return NextResponse.json({ data: txnData, status: 204 })
    } catch (e) {
      return NextResponse.json({error:e, status: 500 });
    }
  }