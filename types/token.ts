export default interface JWT {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};