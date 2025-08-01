import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = "http://localhost:5001";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    console.log("Register request:", { name: username, email });

    const response = await axios.post(`${API_URL}/api/auth/register`, {
      name: username, 
      email,
      password
    });

    console.log("Register response:", response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        error: error.response?.data || 'Registration failed. Please try again.' 
      },
      { status: error.response?.status || 500 }
    );
  }
}