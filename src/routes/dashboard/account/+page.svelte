<script lang="ts">
	import { getContext } from 'svelte';
	import { z } from "zod";
	import ContactForm from "$lib/components/common/ContactForm.svelte";
	import { superForm } from 'sveltekit-superforms/client';
	import { login_schema } from "$lib/form_schemas/login";

export const change_email_schema = z.object({
    email: z.string().email(),
    new_email: z.string().email(),
		user_id: z.string()
});
export const delete_account_schema = z.object({
    consent: z.preprocess(val => val ? true : false, z.boolean()),
    email: z.string().email(),
		user_id: z.string()
});

	export let data;
	let sorted_data = getContext('data');
const {form, errors, message, constraints, enhance } = superForm(data.email_form, {
			validators: change_email_schema,
			validationMethod: "oninput",
			defaultValidator: "keep"
		});

	const {
	form: delete_form,
	errors: delete_errors, 
	message: delete_message, 
	constraints: delete_constraints, 
	enhance: delete_enhance 
	} = superForm(data.delete_form, {
			validators: delete_account_schema,
			validationMethod: "oninput",
			defaultValidator: "keep"
	});
</script>
<section class="account-container">
	<section class="change-email-container">
		<div class="text-container">
		<h3 class="title">
		Change email
		</h3>
		<p class="text">
			To change your email, enter your current and new email below and click "change". You will receive an email containing a link. Follow this link in your browser to confirm the change.
		</p>
		</div>
		{#if $message}
		<p class="text" data-testid="change-email-response">
			We have sent you an email. Please follow the link to change your email address.
		</p>

		{:else}
			<form method="POST" use:enhance action="?/email">
				<label for="email">Current Email
					<input
						type="email"
						name="email"
						aria-invalid={$errors.email ? 'true' : undefined}
						bind:value={$form.email}
						{...$constraints.email} 
					/>
				</label>
					{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

				<label for="email">New Email
					<input
						type="email"
						name="new_email"
						aria-invalid={$errors.new_email ? 'true' : undefined}
						bind:value={$form.new_email}
						{...$constraints.new_email} 
					/>
				</label>
					{#if $errors.new_email}<span class="invalid">{$errors.new_email}</span>{/if}
				<div class="input-description">

				<div class="input-description">

				</div>
		<input type="hidden" name="user_id" value={$form.user_id} />
				<div><button class="button-big">Change</button></div>
			</form>
		{/if}
	</section><!--account-quote-tool-container-->
	<section class="delete-account-container">
		<div class="text-container">
			<h3 class="title">
				Delete account
			</h3>
			<p class="text">
				At Considerate Digital, we take the removal of your data seriously. Once you confirm your action in the checkbox below and click "delete", all of your personal data will be deleted permenently. 
			</p>
			<p class="text">
				This action cannot be undone so make sure you are confident before you click.
			</p>
		</div>
		{#if $delete_message}
		<p class="text" data-testid="delete-account-response">
			We have deleted your user account and sent you an email to confirm this action.
		</p>
		{:else}
			<form class="email-cert-form" method="POST" use:delete_enhance action="?/delete">
				<label class="checkbox-label">
					Are you sure?
					<input
					bind:value={$delete_form.consent}
					type="checkbox"
					name="consent"
					aria-invalid={$delete_errors.consent ? "true" : undefined}
					{...$delete_constraints.consent} />
				</label>

				{#if $delete_errors.consent}
					<div class="error error-message">{$delete_errors.consent}</div>
				{/if}
				<p>
					Enter your email to confirm you would like to delete your account.
				</p>
				<label for="email">Email
					<input
						type="email"
						name="email"
						aria-invalid={$delete_errors.email ? 'true' : undefined}
						bind:value={$delete_form.email}
						{...$delete_constraints.email} 
					/>
				</label>
					{#if $delete_errors.email}<span class="invalid">{$delete_errors.email}</span>{/if}


				<div class="input-description">
					If you choose to delete your account, all of your data will be removed. You will not be able to re-activate your account or save the current data.
				</div>
				<input type="hidden" name="user_id" bind:value={$form.user_id} />
				<button class="button-big">Delete</button>
			</form>
		{/if}
	</section><!--account-change-password-container-->
	<section class="contact-container">
		<h3 class="contact-title">
			Say hello
		</h3>
		<p class="contact-text">
Want to work together or find out more? Send us a message and we will get back to you.
		</p>

		<ContactForm />
	</section><!--account-shared-access-container-->
</section><!--account-container-->

<style>
	.account-container {
		height: calc(100% - calc(var(--base-measure) * 5));
		display:grid;
		grid-template-columns: 1fr ;
		grid-template-rows: auto;
	}
	.change-email-container, .delete-account-container {
		padding: calc(var(--base-measure) * 2);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-bottom: calc(var(--base-measure) * 18);
	}
	.input-description {
		font-size: var(--pub-label-font-size);
		font-style: italic;
	}
	.checkbox-label, .checkbox-label input {
		display: inline;
		width: max-content;
	}
	.contact-container {
		padding: calc(var(--base-measure) * 2);
	}
	.contact-title, .title {
		font-family: bodyFont;
		font-size: var(--pub-title-sans-font-size);
	}
	@media only screen and (min-width: 32rem) {
		.account-container {
			grid-template-columns: repeat(2, minmax(0,1fr)) ;
		}
			}

	@media only screen and (min-width: 80rem) {
		.account-container {
			grid-template-columns: repeat(3, minmax(0,1fr)) ;
		}
		.change-email-container, .delete-account-container {
			margin-bottom: 0rem;
		}

	.change-email-container {
		grid-column: 1/2;
	}
	.delete-account-container {
		grid-column: 2/3;
	}
	.contact-container {
		grid-column: 3/4;
	}

	}
</style>
