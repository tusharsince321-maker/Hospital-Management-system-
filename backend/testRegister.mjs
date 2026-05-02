async function testRegister() {
  try {
    // 1. Register User
    const res = await fetch("http://localhost:4000/api/v1/user/patient/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        email: "test.user.new@example.com", // new email
        phone: "01234567890",
        nic: "1234567890123",
        dob: "1990-01-01",
        gender: "Male",
        password: "password123",
      })
    });
    const data = await res.json();
    if (!res.ok) {
        console.error("Register Error:", data);
        return;
    }
    
    // 2. Get cookie from response headers
    const setCookieHeader = res.headers.get('set-cookie');
    console.log("Set-Cookie header:", setCookieHeader);
    
    // 3. Test /me
    const meRes = await fetch("http://localhost:4000/api/v1/user/me", {
        method: "GET",
        headers: {
            "Cookie": setCookieHeader
        }
    });
    const meData = await meRes.json();
    if (meRes.ok) {
        console.log("GetMe Success:", meData.user.firstName);
    } else {
        console.error("GetMe Error:", meData);
    }
    
  } catch (err) {
    console.error("Fetch Error:", err.message);
  }
}

testRegister();
