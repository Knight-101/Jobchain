import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js"; 
import { User } from '@/lib/types';

const supabaseUrl:string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'default'
const supabaseKey:string = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? 'default'

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const userAddress = req.headers.get("address")
    let { data, error } = await supabase.from("Users").select().eq("address",userAddress)
    
    if (error) {
      return NextResponse.json({ message: error.message,status:401})
    }
    return NextResponse.json({ data, status: 204 })
  } catch (e) {
    return NextResponse.json({ status: 500 });
  }
}


export async function POST(req: NextRequest): Promise<Response> {
    try {
      let { data, error } = await supabase.from("Users").insert([{}]).select()
      if (error) {
        return NextResponse.error()
      }
      return NextResponse.json({ data, status: 204 })
    } catch (e) {
      return NextResponse.json({ status: 500 });
    }
  }