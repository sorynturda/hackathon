import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = "http://localhost:5001";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Make a request to the backend API for user registration
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      username,
      email,
      password
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: error.response?.data?.message || 'Registration failed' 
      },
      { status: error.response?.status || 500 }
    );
  }
}