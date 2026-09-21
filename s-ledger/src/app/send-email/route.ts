import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    // Giả lập gửi mail thành công và trả về mã OTP cứng là '1234' cho nhanh gọn
    return NextResponse.json({ success: true, mockOtp: '1234' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}