import { NextRequest } from "next/server";

export type RouteURL = '/api/openid/[provider]';
type Params = {params:{provider:string}};

export async function GET(req: NextRequest, { params }:Params):Promise<Response>{
  if (params.provider != "steam") {
    console.error("OpenID 2.0 Only supports Steam, We got", params.provider)
    return Response.error()
  }

  const {searchParams} = new URL(req.url);
  searchParams.set('code', '123'); //inject a fake code to make nextauth v5 happy
  const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/${params.provider}?${searchParams.toString()}`;
  return Response.redirect(callbackUrl); //this should be your normal nextauth callback url
}

export async function POST(_req: NextRequest):Promise<Response>{
  return Response.json({token: '123'}); //fake token endpoint
}
//You can hardcode provider to be 'steam'
