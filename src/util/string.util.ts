export class StringUtil {
    public static ParseCredentialsFromBasicAuthHeader(authHeader: string): {
        email: string;
        password: string;
    } {
        const base64Credentials = authHeader.split(" ")[1];
        const decodedCredentials = StringUtil.Base64Decode(base64Credentials);
        const [email, password] = decodedCredentials.split(":");
        return { email, password };
    }

    public static GetBearerTokenFromAuthHeader(authHeader: string): string {
        return authHeader.split(" ")[1];
    }

    public static Base64Encode(data: string): string {
        return Buffer.from(data).toString("base64");
    }

    public static Base64Decode(data: string): string {
        return Buffer.from(data, "base64").toString("utf-8");
    }
}
