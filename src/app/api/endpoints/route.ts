import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  const endpointId = crypto.randomUUID()
  return NextResponse.json({ endpointId }, { status: 201 })
}
