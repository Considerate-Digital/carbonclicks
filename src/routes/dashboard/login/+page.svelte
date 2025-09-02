<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { login_schema } from "$lib/form_schemas/login";

	let tokenAvailable = false;
	let tokensMatch = false;
	let forgotEmailSent = false;

	export let data;

	const {form, errors, message, constraints, enhance } = superForm(data?.form, {
			validators: login_schema,
			validationMethod: "oninput",
			defaultValidator: "keep"
	});

	if (import.meta.env.VITE_DOMAIN_ADDRESS == "https://analytics.considerate.digital") {
		$form.consent = true
	}
	
</script>
<div class="login-page-wrapper">
	<section class="login-page-container">
		<div class="login-page-login-container">
<div class="login-wrapper">
<section class="login-container">
	{#if $message} 
		<div class="text-container">
		<h2 class="login-title">Check your email</h2>
		{#if import.meta.env.VITE_DOMAIN_ADDRESS === "http://localhost:5173"}
			<p class="login-token">{$message}</p>
		{/if}

		<p>
			Please check your email and click the button or follow the link enclosed to access your CarbonClicks account.
		</p>
	</div>

	{:else}
	<div class="text-container">
		<h2 class="login-title">Login</h2>
			<p>

				CarbonClicks is a free*, state-of-the-art solution for real-time carbon monitoring of websites. CarbonClicks is designed to provide high-quality insights and essential metrics crucial for understanding the carbon footprint of digital products and services.
			</p>
			<p>
				<small>* CarbonClicks is open source and free to self-host and distribute. Considerate Digital also provides a hosted version of CarbonClicks that is free for websites with moderate web traffic.</small>
		</p>
			<p>
					</div>

				<form method="POST" use:enhance>
					<p>
						Enter your email address to access CarbonClicks.
					</p>

				<label for="email">Email
					<input
						type="email"
						name="email"
						aria-invalid={$errors.email ? 'true' : undefined}
						bind:value={$form.email}
						{...$constraints.email} 
					/>
				</label>
					{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
				{#if import.meta.env.VITE_DOMAIN_ADDRESS == "https://analytics.considerate.digital"}
				<label class="checkbox-label">
					I consent to share my email with Considerate Digital
				<input
				bind:value={$form.consent}
				type="checkbox"
				name="consent"
				aria-invalid={$errors.consent ? "true" : undefined}
				{...$constraints.consent} />
			</label>
			{/if}

			{#if $errors.consent}
				<div class="error error-message">{$errors.consent}</div>
			{/if}

			<div class="input-description">
					{#if import.meta.env.VITE_DOMAIN_ADDRESS == "https://carbonclicks.io"}
				We do not share your details with any third parties. However, we would like to email you to provide tailored analytics reports or to share our research and news. Read more about our <a href="https://considerate.digital/terms">Terms and Privacy Policy</a>. Considerate Digital is committed to protecting all data that is given to us. 

					{/if}
					<div><button class="button">Go</button></div>
			</form>
		{/if}
	</section><!--login-container-->
	</div><!--login-wrapper-->
</div><!--login-page-login-container-->

	{#if data?.email_change }
	<section class="email-change-container">
		<h3 class="email-title">
			{#if data.email_change}
				Change successful
			{:else}
				Change failed
			{/if}
		</h3>
		<p class="text">
			{#if data.email_change}
				We have successfully changed your email. You can now login with your new emaill address.
			{:else}
				We were not able to change your email. Please try again and contact us if this issue persists. 
			{/if}
		</p>
	</section><!--email-change-container-->
{:else}
	<section class="demo-container">
		<div>
		<h3 class="demo-title">
			Try the demo
		</h3>
		<p class="text">
			Have a look around with our interactive demo that uses "considerate.digital" as an example website with a random selection of auto-generated webpages.  
		</p>
		<p class="text">
			Our demo generates a random carbon analytics dataset from users all over the world. You can sample our whole service without needing to connect your website. 
		</p>
		</div>
		<a href="/dashboard?demo=true" target="_blank" data-sveltekit-reload>
			<button class="button--secondary">Demo</button>
		</a>
	</section><!--demo-container-->
	{/if}
	<section class="discover-container">
		<div>
			<h3 class="email-title">
				Find out more
			</h3>
			<ul>
				<li>
					<p>
						<strong>Real-time Carbon Monitoring:</strong>
						CarbonClicks delivers real-time analytics on the carbon emissions of websites, enabling organisations to make informed decisions towards sustainability.
					</p>
				</li>
				<li>
					<p>
						<strong>Open Source:</strong>
						CarbonClicks is <a href="https://github.com/Considerate-Digital/carbonclicks" target="_blank">open source</a>, licensed under the FSL-1.1-MIT. The software is free to self-host and distribute under any purpose other than a Competing Use. 
					</p>
				</li>
				<li>
					<p>
						<strong>Free:</strong>
						Considerate Digital provides a free hosted version of CarbonClicks to small and medium-sized organisations with moderate web-traffic. 
					</p>
				</li>
				<li>
					<p>
						<strong>Privacy-Focused:</strong>
						The tool ensures user privacy by abstaining from storing personally identifiable information and refraining from the use of tracking cookies.
					</p>
				</li>
				<li>
					<p>
						<strong>GDPR Compliant:</strong>
						CarbonClicks does not retain any identifying data about users, including IP addresses. The service is designed to be GDPR compliant without the need for cookies.
					</p>
				</li>
			</ul>
		</div>

			<a href="/guide/carbon-clicks" target="_blank">
				<button class="button--secondary">Find out more</button>
			</a>
		</section><!--discover-container-->

</section><!--login-page-container-->
</div><!--login-page-wrapper-->

<style>
	.login-page-wrapper {
		height: calc(100% - calc(var(--base-measure) * 10));
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.login-page-container {
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto;
	}
	.login-page-reset-password-container {
		width: 100%;

	}
	.login-page-login-container {
		/*
		max-width: 30rem;
		*/
	}
	.login-wrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.login-container, .email-change-container, .demo-container, .discover-container {
		height: 100%;
		width: 100%;
		min-width: 20em;
		display:flex;
		flex-direction: column;
		justify-content: space-between;
		padding: calc(var(--dash-base-measure) * 2);
	}
	.login-input-container {
		padding-bottom: 0rem;
	}
	.login-title, .email-title, .demo-title {
		margin-bottom: calc(var(--dash-base-measure) * 2);
	}
	.input-description, .download-sub-text {
		font-size: var(--pub-label-font-size);
		font-style: italic;
		margin-top: calc(var(--base-measure) * 1);
	}
	.checkbox-label, .checkbox-label input {
		display: inline;
		width: max-content;
	}
	.login-button-container {
		margin-top: calc(var(--dash-base-measure) * 4);
		width: 100%;
	}
	
	.no-account-privacy-text-container {
		font-size: 0.8rem;
		padding: var(--dash-component-padding); 
		padding-top: 0em;
		padding-bottom: 0em;
	}
	.no-account-privacy-text {
		font-size: var(--baseFontsize);
	}
	.privacy-and-website-container {
		padding: var(--dash-base-measure); 
		padding-top: 0rem;
	}
	.privacy-and-website-buttons-container {
		align-items: center;
	}

	.error-title {
		text-align: left;
		margin-bottom: 0em;
	}
	.error-message {
		margin: 0em;
	}
	.link-button {
		border: transparent;
		color: var(--dark-green);
	}
	.forgot-email-text {
		font-size: var(--baseFontsize);

	}

	.email-change-container {
		display: block;
	}
	

	@media only screen and (min-width: 80rem) {
	.login-page-container {
		grid-template-columns: 1fr 1fr 1fr;
	}
	.login-page-login-container {
		max-width: 100%;
	}
	}
</style>
