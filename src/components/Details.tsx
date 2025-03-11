import React from "react";

const Details = () => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-md text-black">
      {/* Risk Section */}
      <h2 className="text-lg font-bold text-red-600 mb-2">
        🔴 Why Sending Refresh Tokens to the Frontend is Risky
      </h2>
      <div className="ml-0">
        <p>
          <strong>1. Stored in Local Storage / Session Storage:</strong> If you
          store the refresh token in{" "}
          <code className="bg-gray-100 p-1 rounded text-black">
            localStorage
          </code>{" "}
          or{" "}
          <code className="bg-gray-100 p-1 rounded text-black">
            sessionStorage
          </code>
          , it is vulnerable to{" "}
          <strong>XSS (Cross-Site Scripting) attacks</strong>.
        </p>
        <p>
          <strong>2. Stored in Memory:</strong> If you store it in memory (React{" "}
          <code className="bg-gray-100 p-1 rounded text-black">useState</code>),
          it disappears on page reload.
        </p>
        <p>
          <strong>3. Intercepted in API Calls:</strong> If refresh tokens are
          sent in API requests, they can be stolen if an attacker gains access
          to the network.
        </p>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* Best Practice Section */}
      <h3 className="text-lg font-bold text-green-600 mb-2">
        ✅ Best Practice: Store Refresh Tokens in HTTP-Only Cookies
      </h3>
      <div className="ml-0">
        <p>A more secure approach is:</p>
        <p>✔ Store the refresh token server-side (in a database).</p>
        <p>
          ✔ Use an <strong>HTTP-only, Secure Cookie</strong> to send the refresh
          token to the client.
        </p>
        <p>
          ✔ This prevents JavaScript from accessing the token, mitigating XSS
          attacks.
        </p>
      </div>
    </div>
  );
};

export default Details;
