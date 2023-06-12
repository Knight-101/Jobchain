import { toast } from "react-toastify";
import { User } from "./types";

const domain:string = process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"

const endpoint:string = domain + "/api/jobcoin";

interface UserResponseBody {
    data: any;
    user:User,
    status:number
}

export interface TxnObject {
    from:string,
    to:string,
    amount:number
}

export interface TransactionsResponse {
    id:number,
    created_at:Date,
    from:string,
    to:string,
    amount:number
}

export async function createUser<T>({
    headers,
  }: {
    headers?: HeadersInit;
    cache?: RequestCache;
  }): Promise<{ status: number; body: UserResponseBody } | never> {
    try {
      const result = await fetch(`${endpoint}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
      });
  
      const body = await result.json();
  
      if (body.errors) {
        throw body.errors[0];
      }
  
      return {
        status: result.status,
        body
      };
    } catch (e) {
        toast.error("Something went wrong. Please try again!")
      throw {
        error: e,
      };
    }
  }

  export async function getUser<T>({
    headers
  }: {
    headers?: HeadersInit;
    cache?: RequestCache;
  }): Promise<User[]> {
    try {
      const result = await fetch(`${endpoint}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
      });

      const body = await result.json();
  
      if (body.errors) {
        throw body.errors[0];
      }

      return body?.data;
    } catch (e) {
      console.log(e)
        toast.error("Something went wrong. Please try again!")
      throw {
        error: e,
      };
    }
  }

  export async function sendJobcoins<T>({
    txn,
    headers,
  }: {
    txn?: TxnObject;
    headers?: HeadersInit;
    cache?: RequestCache;
  }): Promise<{ status: number; body: UserResponseBody } | never> {
    try {
      
      const result = await fetch(`${endpoint}/txn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(txn),
      });
  
      const body = await result.json();
  
      if (body.errors) {
        throw body.errors[0];
      }
  
      return {
        status: result.status,
        body
      };
    } catch (e) {
        toast.error("Something went wrong. Please try again!")
      throw {
        error: e,
      };
    }
  }


  export async function checkBalance<T>({
    user,
    amount
  }: {
    user: string;
    amount: number;
  }): Promise<boolean> {
    try {
      const userDetails = await getUser({
        headers: { "address": user },
        cache: 'no-store'
    });
    if (userDetails[0].balance < amount) {
        return false
    }
    return true
    } catch (e) {
        toast.error("Something went wrong. Please try again!")
      throw {
        error: e,
      };
    }
  }

  export async function checkUser<T>({
    user
  }: {
    user: string;
  }): Promise<boolean> {
    try {
      
      const userDetails = await getUser({
        headers: { "address": user },
        cache: 'no-store'
    });
    if (!userDetails) {
        return false
    }
    return true
    } catch (e) {
        toast.error("Something went wrong. Please try again!")
      throw {
        error: e,
      };
    }
  }

  export async function getTransactions<T>({
    headers
  }: {
    headers?: HeadersInit;
    cache?: RequestCache;
  }): Promise<TransactionsResponse[]> {
    try {
      const result = await fetch(`${endpoint}/txn`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
      });

      const body = await result.json();
  
      if (body.errors) {
        throw body.errors[0];
      }

      return body?.data;
    } catch (e) {
      console.log(e)
        toast.error("Something went wrong. Please try again!")
      throw {
        error: e,
      };
    }
  }