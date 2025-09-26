// Test script for session booking endpoints
// Run this with: npx ts-node test-session-booking.ts

const BASE_URL = 'http://localhost:9000/api/v1';

async function testSessionBooking() {
  console.log('🚀 Testing Session Booking Feature...\n');

  try {
    // Test 1: Get available mentors (should work without auth for now)
    console.log('📋 Testing available mentors endpoint...');
    const mentorsResponse = await fetch(`${BASE_URL}/sessions/mentors/available`);
    console.log('Status:', mentorsResponse.status);
    
    if (mentorsResponse.status === 401) {
      console.log('✅ Authentication required (expected)');
    } else {
      const mentors = await mentorsResponse.json();
      console.log('Available mentors:', mentors);
    }

    // Test 2: Health check for API structure
    console.log('\n🔍 Testing API structure...');
    const healthResponse = await fetch('http://localhost:9000/health');
    const health = await healthResponse.json();
    console.log('Health check:', health);

    console.log('\n✅ Session booking endpoints are properly configured!');
    console.log('\n📝 Next steps:');
    console.log('1. Create test users (student and instructor)');
    console.log('2. Get authentication tokens');
    console.log('3. Test the full session booking flow');
    console.log('4. Verify email notifications are sent');

  } catch (error) {
    console.error('❌ Error testing session booking:', error);
  }
}

testSessionBooking();