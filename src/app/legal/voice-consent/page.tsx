export default function VoiceConsentPage() {
  return (
    <article>
      <h1>Voice Consent Policy</h1>
      <p className="text-muted-foreground">Last updated: May 31, 2026</p>
      
      <h2>1. Purpose</h2>
      <p>This policy governs the collection, use, and protection of voice data used to train personal AI voice models (&quot;Voice DNA&quot;) on the U&M Music AI platform.</p>
      
      <h2>2. Consent Requirements</h2>
      <p>Before training a Voice DNA model, users must:</p>
      <ul>
        <li>Explicitly confirm they are the owner of the voice being trained</li>
        <li>Or provide documented proof of permission from the voice owner</li>
        <li>Complete a voice verification recording</li>
        <li>Accept this Voice Consent Policy</li>
      </ul>
      
      <h2>3. Prohibited Uses</h2>
      <ul>
        <li><strong>Impersonation of celebrities, public figures, or other singers is strictly prohibited</strong></li>
        <li>Training voice models of minors without parental consent</li>
        <li>Using voice models for deceptive, fraudulent, or harmful purposes</li>
        <li>Distributing or selling voice models without the voice owner&apos;s consent</li>
      </ul>
      
      <h2>4. Data Protection</h2>
      <ul>
        <li>Voice samples are encrypted during upload and storage</li>
        <li>Voice models are stored in isolated, secure environments</li>
        <li>Access to voice models is restricted to the account owner only</li>
        <li>We implement industry-standard security measures</li>
      </ul>
      
      <h2>5. Your Rights</h2>
      <ul>
        <li>You can delete your voice model and all training data at any time</li>
        <li>You can withdraw consent at any time, which will trigger deletion of your voice model</li>
        <li>You can request a copy of your voice data</li>
      </ul>
      
      <h2>6. Enforcement</h2>
      <p>Violations of this policy may result in immediate account suspension, deletion of voice models, and potential legal action.</p>
      
      <h2>7. Updates</h2>
      <p>We may update this policy to reflect changes in our practices or legal requirements. We will notify users of significant changes.</p>
    </article>
  );
}
