export const userPasswordResetTemplate = (replacements: any): string => {
return `<p>
    Hey ${replacements.Email}! It looks like you may have request a password reset. No worries! Please click the link below and you'll be all set!
    If you didn't request a password reset, you can safely disregard this email.
</p>

<br />
<br />
<a href="${replacements.URL}">CLICK HERE!</a>
`;
};