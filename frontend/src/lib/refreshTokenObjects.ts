export interface RefreshRequestDto {
  grant_type: string;
  client_id: string;
  refresh_token: string;
  client_secret: string;
}

export interface RefreshResponseDto {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  not_before_policy: number;
  session_state: string;
  scope: string;
}
