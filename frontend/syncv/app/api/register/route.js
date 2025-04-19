// app/api/register/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = "http://localhost:5001";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    console.log("Register request:", { name: username, email });

    // Make a request to the backend API for user registration
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      name: username, // Changed from username to name to match backend
      email,
      password
    });

    console.log("Register response:", response.data);

    // Return success response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    
    // Create a more detailed error response
    return NextResponse.json(
      { 
        error: error.response?.data || 'Registration failed. Please try again.' 
      },
      { status: error.response?.status || 500 }
    );
  }
}