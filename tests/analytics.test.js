import { test, expect } from "@playwright/test";

test.describe("Analytics api", () => {
  test("Analytics api test", async ({ page, request }) => {
    // prepare view so that it uses the same keys as the script
    let data = `{"id":"3fd92bb7daf4446c23ed440fa739eaeb24d7c44193728d70f4c6f5cf0e33c7aedf90a3a914881dd62913688c0f2da2366867b13f184e30f7bb2ba7d328644846","account_id":"demo","date":"2024-06-15T16:31:33.752Z","url":"considerate.digital/private/women","url_hash":"0ed689ebd57018d7d7825b4ef66dbbf8f7e91a5d2ca93a126f6f31c0a62ac7fc133597a8d79976be5a292c5c8db6be6aad70569173729518b1ffd70007c4e948","path":"private/women","referrer":"","title":"","events":[],"screen_width":900,"screen_height":1400,"device_pixel_ratio":1,"session_length":31543,"scroll":true,"bot":false,"query":"","transfer":3150341,"country":"URY","dom_interactive":2526,"dom_complete":1008,"dom_load_event_fired":1843,"resources":[],"green":true,"user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.3"}`;

    const analytics_req = await request.post("/public/api/analytics", {
      data: data,
    });

    expect(analytics_req.ok()).toBeTruthy();
  });
});
