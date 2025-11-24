import "@/features/footer/footer.css";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    BookBounty
                </div>
                <p className="footer-copyright">
                    Copyright &copy; {new Date().getFullYear()} BookBounty. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
