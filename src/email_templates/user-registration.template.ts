export const userRegistrationTemplate = (replacements: any): string => {
    return `<p>
            Hey ${replacements.Email} and Welcome To OpenZooSim! There's just one more step to verifying your new account. Please click the link below and you'll be all set!
        </p>
        
        <br />
        <br />
        <a href="${replacements.URL}">CLICK HERE!</a>
    `;
};
