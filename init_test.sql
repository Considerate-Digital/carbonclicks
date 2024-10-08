
CREATE TABLE IF NOT EXISTS users (
  id varchar(36),
  first_name varchar(255),
  last_name varchar(255),
  phone_number int,
  email varchar(255),
  email_validated boolean,
  signup_date date,
  login_token varchar(36),
  login_token_expiry timestamp,
  last_login timestamp,
  login_count int,
  pw varchar(255),
  pw_reset_token varchar(36),
  pw_reset_token_expiry timestamp,
  session_token varchar(36),
  session_expiry timestamp,
  recovery_email varchar(255),
  level varchar(255),
  permissions varchar(255)[],
  primary_analytics_accounts varchar(36)[],
  secondary_analytics_accounts varchar(36)[]
);


CREATE TABLE IF NOT EXISTS analytics_accounts (
    id varchar(36),
    primary_user_id varchar(36),
    secondary_user_ids varchar(36)[],
    paid boolean, 
    last_accessed timestamp,
    tokens int,
    tokens_last_updated timestamp,
    name varchar(255),
    creation_date date,
    quote_price decimal(19, 4),
    quote_date date,
    quote_requested boolean,
    stripe_customer_id varchar(255),
    stripe_payment_plan_id varchar(255),
    stripe_subscription_id varchar(255),
    report_ids varchar(36)[]               
);

CREATE TABLE IF NOT EXISTS analytics_reports (
    id varchar(36),
    account_id varchar(36),
    date date,
    date_range_start date,
    date_range_end date,
    website_name varchar(255),
    url_ids varchar(36)[],
    data_center_location varchar(8),
    data_center_renewable decimal(6, 2),
    data_center_fully_renewable boolean,
    kwhGb decimal(6, 2),
    total_transfer_size decimal(19, 2),
    em_client decimal(19, 2),
    em_av_client_gr_per_req decimal(19,2),
    em_data_centers decimal(19, 2),
    em_av_data_centers_gr_per_req decimal(19, 2),
    em_total decimal(19, 2),
    em_av_combined_gr_per_req decimal(19, 2),
    improve_total_gr decimal(6, 2),
    improve_total_size decimal (6, 2),
    errors jsonb
);

CREATE TABLE IF NOT EXISTS urls (
    id varchar(36),
    date date, 
    account_id varchar(36),
    report_id varchar(36),
    url varchar(2000),
    url_path varchar(2000),
    website_name varchar(2000),
    rating varchar(3),
    certified boolean,
    registrar_email varchar(255),
    emission decimal(19, 2),
    renewable_hosting boolean,
    hosting_location varchar(3),
    hosting_provider varchar(255),
    hosting_grid_intensity decimal(19, 2),
    hosting_documents jsonb,
    improve_total_gr decimal(19, 2),
    improve_total_size decimal(19, 2)
);

CREATE TABLE IF NOT EXISTS hars (
  id varchar(36),
  url_id varchar(36),
  server_ip varchar(36),
  streaming_elements int,
  videos int,
  video_array jsonb,
  iframes int,
  iframe_array jsonb,
  images int,
  image_array jsonb,
  audios int,
  audio_array jsonb,
  fonts int,
  font_array jsonb,
  javascripts int,
  javascript_array jsonb,
  csss int,
  css_array jsonb,
  url varchar(2000),
  meta_browser jsonb,   
  meta_started_date_time varchar(255), 
  final_url varchar(2000),
  base_domain varchar(2000),
  first_party_reg_ex varchar(2000),
  document_redirects int,
  redirect_chain jsonb, 
  transfer_size int,
  content_size int,
  header_size int, 
  requests int,
  cookie_names varchar(255)[],
  cookie_names_third_parties varchar(255)[],
  cookies int,
  missing_compression int,
  fully_loaded decimal(6, 12),
  http_type varchar(255),
  http_version varchar(255),
  html_transfer_size int,
  html_content_size int,
  html_header_size int,
  html_requests int,
  css_transfer_size int,
  css_contentsize int,
  css_header_size int,
  css_requests int,
  javascript_transfer_size int,
  javascript_content_size int,
  javascript_header_size int,
  javascript_requests int,
  image_transfer_size int,
  image_content_size int,
  image_header_size int,
  image_requests int,
  font_transfer_size int,
  font_content_size int,
  font_header_size int,
  font_requests int,
  json_transfer_size int,
  json_content_size int,
  json_header_size int,
  json_requests int,
  assets jsonb,
  response_codes jsonb,
  first_party_cookies int,
  first_party_html jsonb,
  first_party_css jsonb,
  first_party_javascript jsonb,
  first_party_image jsonb,
  first_party_font jsonb,
  first_party_json jsonb,
  first_party_requests int,
  first_party_transfer_size int,
  first_party_content_size int,
  first_party_header_size int,
  third_party_cookies int,
  third_party_html jsonb,
  third_party_css jsonb,
  third_party_javascript jsonb,
  third_party_image jsonb,
  third_party_font jsonb,
  third_party_json jsonb,
  third_party_requests int,
  third_party_transfer_size int,
  third_party_content_size int,
  third_party_header_size int,
  domains jsonb,
  total_domains int
);

CREATE TABLE IF NOT EXISTS analytics (
    id varchar(128),
    account_id varchar(36),
    date timestamp, 
    url varchar(2000),
    url_hash varchar(128),
    path varchar(2000),
    referrer varchar(2000),
    title varchar(255),
    screen_width int,
    screen_height int,
    device_pixel_ratio decimal(4,2),
    session_length int,
    scroll boolean,
    bot boolean,
    query varchar(255),
    transfer int,
    country varchar(3),
    dom_interactive int,
    dom_complete int,
    dom_load_event_end int,
    green boolean,
    user_agent varchar(255),
    unique_view boolean
);

CREATE TABLE IF NOT EXISTS analytics_events (
    type varchar(255),
    date timestamp, 
    target_tag varchar(255),
    target_id varchar(255),
    target_class varchar(255),
    target_text varchar(100),
    page_x int,
    page_y int 
);

CREATE TABLE IF NOT EXISTS analytics_resources (
    url varchar(2000) UNIQUE,
    date timestamp, 
    type varchar(255),
    duration int,
    transfer_size int,
    optimised_size int
);

/* This creates a default user that we can delete in testing */
INSERT INTO users VALUES(
  'demo',
  '',
  '',
  0000000,
  'test_test_test_test_exists@considerate.digital',
  TRUE,
  '2024-01-01',
  'SNTHTHTHSNH',
  '1999-01-08 04:05:06',
  '1999-01-08 04:05:06',
  2,
  '',
  '',
  '1999-01-08 04:05:06',
  '',
  '1999-01-08 04:05:06',
  '',
  '{}',
  '{}',
  '{}'
);
INSERT INTO users VALUES(
  'demo_2',
  '',
  '',
  0000000,
  'test_test_test_test_email_change@considerate.digital',
  TRUE,
  '2024-01-01',
  'SNTHTHTHSNH',
  '1999-01-08 04:05:06',
  '1999-01-08 04:05:06',
  2,
  '',
  '',
  '1999-01-08 04:05:06',
  '',
  '1999-01-08 04:05:06',
  '',
  '{}',
  '{}',
  '{}'
);
  


