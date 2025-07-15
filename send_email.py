#!/usr/bin/env python3
"""
Email sender script for Cindi update
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import getpass

def send_email():
    # Read the HTML file
    with open('CINDI_UPDATE_EMAIL_STYLED.html', 'r') as f:
        html_content = f.read()
    
    # Email settings
    to_email = "jassonwilliamgolden@gmail.com"
    subject = "Your Practice Technology Update - 90% Complete! 🚀"
    
    print("=== Email Sender ===")
    print(f"To: {to_email}")
    print(f"Subject: {subject}")
    print("\nChoose email provider:")
    print("1. Gmail")
    print("2. Outlook/Hotmail")
    print("3. Yahoo")
    print("4. Other SMTP")
    
    choice = input("\nEnter choice (1-4): ")
    
    # SMTP settings based on choice
    smtp_settings = {
        "1": ("smtp.gmail.com", 587),
        "2": ("smtp-mail.outlook.com", 587),
        "3": ("smtp.mail.yahoo.com", 587),
        "4": (None, None)
    }
    
    if choice in smtp_settings:
        smtp_server, smtp_port = smtp_settings[choice]
        
        if choice == "4":
            smtp_server = input("Enter SMTP server: ")
            smtp_port = int(input("Enter SMTP port: "))
        
        from_email = input("Enter your email address: ")
        password = getpass.getpass("Enter your email password: ")
        
        # For Gmail, you might need an app password instead of regular password
        if choice == "1":
            print("\nNote: For Gmail, you may need to use an App Password instead of your regular password.")
            print("Get one at: https://myaccount.google.com/apppasswords")
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = to_email
        
        # Attach HTML
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        try:
            print(f"\nConnecting to {smtp_server}:{smtp_port}...")
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(from_email, password)
            
            print("Sending email...")
            server.send_message(msg)
            server.quit()
            
            print("✅ Email sent successfully!")
            
        except Exception as e:
            print(f"❌ Error sending email: {e}")
    else:
        print("Invalid choice")

if __name__ == "__main__":
    send_email()