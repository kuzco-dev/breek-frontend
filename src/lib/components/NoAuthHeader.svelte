<script lang="ts">

  import { X } from "$lib"

	let showLoginPopup = $state(false);

  let showSignupPopup = $state(false);

  let showLoginOtp = $state(false);

  let showSignupOtp = $state(false);

  let showLoginError = $state("");

  let showSignupError = $state("");

  let loginData = $state({
    email: "",
    otp: ""
  });

  let SignupData = $state({
    username: "",
    email: "",
    otp: ""
  });


  async function handleSignupSubmit(event: Event){

    event.preventDefault();

    try {
			const response = await fetch('https://api.breek.live/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: "include",
				body: JSON.stringify({
          username: SignupData.username,
					email: SignupData.email,
				})
			});

			if (response.ok) {
        showLoginOtp = true;
			} else {
				const data = await response.text();
        console.log(data)
        showSignupError = data;
			}
		} catch (error) {
      showSignupError = "Internal error, try later";
		}
  }

  async function handleSignupOtpSubmit(event:Event) {
    event.preventDefault();
    
    try {
      const response = await fetch('https://api.breek.live/verify-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          otp: SignupData.otp
        })
      });

      if (response.ok) {
        showSignupPopup = false;
        showSignupOtp = false;
      } else {
        const data = await response.text();
        showSignupError = data;
      }
    } catch (error) {
      showSignupError = "Internal error, try later";
    }
  }

</script>

<div class="flex gap-4 items-center">
	<button class="cursor-pointer hover:text-primary transition-colors duration-200" onclick={() => showLoginPopup = true}>Log in</button>
  <button class="cursor-pointer bg-primary py-1 px-2 rounded-sm hover:bg-primary/90 transition-colors duration-200" onclick={() => showSignupPopup = true}>Create account</button>
</div>

{#if showSignupPopup}
	<div class="fixed inset-0 flex items-center justify-center z-[50] bg-background/70">
		<div class="bg-card border border-border p-4 rounded-lg flex flex-col">
      <div class="flex justify-between">
        <div class="text-xl">
          Join Breek now !
        </div>
        <button onclick={() => { showSignupPopup = false; showSignupOtp = false; }} class="cursor-pointer"><X /></button>
      </div>

      {#if showLoginOtp}
        <form onsubmit={handleSignupOtpSubmit} class="mt-6 mb-2 flex flex-col gap-4 w-full">
					<input type="text" bind:value={SignupData.otp} required class="p-2 rounded-lg border border-border w-full" placeholder="Enter 6-digit code" maxlength="6" inputmode="numeric" />
					<button type="submit" class="bg-green-400 p-2 rounded-lg w-full cursor-pointer">Verify OTP</button>
				</form>
				<p class="text-xs text-muted-foreground">Enter the 6-digit code sent to your email.</p>
      {:else}
        <form onsubmit={handleSignupSubmit} class="mt-6 mb-2 flex flex-col gap-4 w-full">
          <input type="text" bind:value={SignupData.username} required class="p-2 rounded-lg border border-border w-full" placeholder="Username" />
          <input type="email" bind:value={SignupData.email} required class="p-2 rounded-lg border border-border w-full" placeholder="Email" />
          <button type="submit" class="bg-green-400 p-2 rounded-lg w-full cursor-pointer">Create account</button>
        </form>
        <p class="text-xs text-muted-foreground">You will receive a 6-digit code in your email inbox.</p>
      {/if}
		</div>
	</div>
{/if}