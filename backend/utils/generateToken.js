import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Always secure for cross-site
        sameSite: 'none', // Required for Netlify -> Render
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

export default generateToken;
