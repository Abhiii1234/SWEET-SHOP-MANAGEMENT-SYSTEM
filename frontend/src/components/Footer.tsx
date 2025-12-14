import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '1.5rem',
            marginTop: 'auto',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(10px)'
        }}>
            Built with ❤️ by{' '}
            <a
                href="https://www.linkedin.com/in/abhigyan-pushkar-778420266/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary)'}
            >
                ABHIGYAN PUSHKAR
            </a>
        </footer>
    );
};

export default Footer;
