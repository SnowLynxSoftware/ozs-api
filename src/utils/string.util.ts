export class StringUtil {
    public static ParseCredentialsFromBasicAuthHeader(authHeader: string): {
        email: string;
        password: string;
    } {
        const base64Credentials = authHeader.split(" ")[1];
        const decodedCredentials = Buffer.from(
            base64Credentials,
            "base64"
        ).toString("utf-8");
        const [email, password] = decodedCredentials.split(":");
        return { email, password };
    }

    public static GetBearerTokenFromAuthHeader(authHeader: string): string {
        return authHeader.split(" ")[1];
    }
}
