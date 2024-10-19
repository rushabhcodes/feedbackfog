import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
  expirationTime: string;
  verificationLink: string;
}

export default function VerificationEmail({ 
  username, 
  otp, 
  expirationTime, 
  verificationLink 
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Account Verification</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Verify your account</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use one of the following methods to verify your account:
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
            Method 1: Enter this verification code on the verification page:
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5em' }}>
            {otp}
          </Text> 
        </Row>
        <Row>
          <Text>
            Method 2: Click the button below to verify your account:
          </Text>
        </Row>
        <Row>
          <Button
            href={verificationLink}
            style={{ background: '#61dafb', color: '#ffffff', padding: '10px 20px' }}
          >
            Verify Account
          </Button>
        </Row>
        <Row>
          <Text>
            This verification code and link will expire in {expirationTime}.
          </Text>
        </Row>
        <Row>
          <Text>
            If you did not request this verification, please ignore this email or contact our support team.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
