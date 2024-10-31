<script>
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Dropdown, DropdownItem, Button } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { DarkMode } from 'flowbite-svelte';
    import { page } from '$app/stores';
    import { _, locale } from 'svelte-i18n';
	import { authStore } from '$lib/Stores/Authentication';
	import { goto } from '$app/navigation';
    $: activeUrl = $page.url.pathname;

  async function handleSignOut() {
		await authStore.signOut();

		goto('/signin');
	}
  </script>
  
  <Navbar class="bg-[#f1f1f1] dark:bg-darkBlue fixed z-50 duration-300 ease-in-out">
    <NavBrand href="/">
        <p
          class="text-lg md:text-2xl text-blue dark:text-blue font-bold"
          style="font-family:Logo;"
        >
          Ahmad Qadiir 
          <!-- {$_("owner-name")} -->
        </p>
      </NavBrand>
    <NavHamburger/>
    <NavUl {activeUrl} ulClass="flex justify-center items-center gap-8 flex-col md:flex-row border-0 p-4">
      <NavLi href="/" activeClass="text-sky-600 font-bold">
        <div class="flex gap-2 justify-center items-center">
            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                                ></path>
                            </svg>

                            <div class="{activeUrl === '/' ? "flex" : "flex md:hidden"}">
                            <p>{$_("home")}</p>
                            </div>
          </div>
    </NavLi>
      
	  <NavLi href="/cards/1" activeClass="text-sky-600 font-bold">
	  <div class="flex gap-2 justify-center items-center">
        <svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
							></path>
						</svg>

                        <div class="{activeUrl === '/cards/1' ? "flex" : "flex md:hidden"}">
                        <p>{$_("cards")}</p>
                        </div>
      </div>
	  </NavLi>


      <NavLi href="/carousels/1" activeClass="text-sky-600 font-bold">
        <div class="flex gap-2 justify-center items-center">
            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d='M4 6h16M4 10h16M4 14h16M4 18h16'
                                ></path>
                            </svg>
                            <div class="{activeUrl === '/carousels/1' ? "flex" : "flex md:hidden"}">
                            <p>{$_("carousel")}</p>
                            </div>
          </div>
    </NavLi>


      <NavLi href="/event" activeClass="text-sky-600 font-bold">
        <div class="flex gap-2 justify-center items-center">
            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                ></path>
                            </svg>
                            <div class="{activeUrl === '/event' ? "flex" : "flex md:hidden"}">
                            <p>{$_("event")}</p>
                            </div>
          </div>
    </NavLi>


      <NavLi href="/representative" activeClass="text-sky-600 font-bold">
        <div class="flex gap-2 justify-center items-center">
            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                ></path>
                            </svg>

                            <div class="{activeUrl === '/representative' ? "flex" : "flex md:hidden"}">
                            <p>{$_("representative")}</p>
                            </div>
          </div>
    </NavLi>


      <NavLi href="/registrations/1" activeClass="text-sky-600 font-bold">
        <div class="flex gap-2 justify-center items-center">
            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                                ></path>
                            </svg>

                            <div class="{activeUrl === '/registrations/1' ? "flex" : "flex md:hidden"}">
                            <p>{$_("registrations")}</p>
                            </div>
          </div>
    </NavLi>


      <NavLi href="/footer" activeClass="text-sky-600 font-bold">
        <div class="flex gap-2 justify-center items-center">
            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d='M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                                ></path>
                            </svg>

                            <div class="{activeUrl === '/footer' ? "flex" : "flex md:hidden"}">
                                <p>{$_("footer")}</p>
                            </div>
                        
          </div>
    </NavLi>

    <div class="flex md:hidden gap-2 justify-center items-center">
    

        <div
                    class="w-auto h-10 rounded-lg bg-[#f1f1f1] dark:bg-blue flex justify-center items-center"
                >
                    <Button
                        class="gap-2 flex bg-blue/60 dark:bg-transparent dark:hover:bg-transparent hover:bg-blue duration-300 ease-in-out"
                    >
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <img
                            class="w-6 h-6 object-cover rounded-full {$locale === 'en'
                                ? 'object-left'
                                : 'object-center'}"
                            src={$locale === 'en' ? '/images/usa.jpg' : '/images/kurdish.svg'}
                        />
                        {$locale === 'en' ? $_('english') : $_('kurdish')}
                        <ChevronDownOutline class="w-auto h-6 ms-2 text-white dark:text-white" />
                    </Button>
    
                    <Dropdown
                        class="w-48 overflow-y-auto py-1 h-auto z-50"
                        containerClass="bg-white/80 dark:bg-darkBlue/80 backdrop-blur-lg rounded-xl z-50"
                    >
                        <DropdownItem
                            class="flex items-center text-base font-semibold gap-2 dark:text-white"
                            on:click={() => {
                                locale.set('en');
                                localStorage.setItem('lang', 'en');
                            }}
                        >
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img class="w-8 h-8 object-cover rounded-full object-left" src="/images/usa.jpg" />{$_(
                                'english'
                            )}
                        </DropdownItem>
                        <DropdownItem
                            class="flex items-center text-base font-semibold gap-2 dark:text-white"
                            on:click={() => {
                                locale.set('ckb');
                                localStorage.setItem('lang', 'ckb');
                            }}
                        >
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img class="w-8 h-8 object-cover rounded-full" src="/images/kurdish.svg" />{$_(
                                'kurdish'
                            )}
                        </DropdownItem>
                    </Dropdown>
                </div>
    
                
                <DarkMode class="text-lg">
                    <svg
                        class="w-[20px] h-[20px] md:w-[40px] md:h-[40px] fill-white"
                        slot="lightIcon"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z"
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3C3.41421 11.25 3.75 11.5858 3.75 12C3.75 12.4142 3.41421 12.75 3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM20.25 12C20.25 11.5858 20.5858 11.25 21 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H21C20.5858 12.75 20.25 12.4142 20.25 12ZM12 20.25C12.4142 20.25 12.75 20.5858 12.75 21V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V21C11.25 20.5858 11.5858 20.25 12 20.25Z"
                        />
                        <g opacity="0.5">
                            <path
                                d="M4.39838 4.39838C4.69127 4.10549 5.16615 4.10549 5.45904 4.39838L5.85188 4.79122C6.14477 5.08411 6.14477 5.55898 5.85188 5.85188C5.55898 6.14477 5.08411 6.14477 4.79122 5.85188L4.39838 5.45904C4.10549 5.16615 4.10549 4.69127 4.39838 4.39838Z"
                            />
                            <path
                                d="M19.6009 4.39864C19.8938 4.69153 19.8938 5.16641 19.6009 5.4593L19.2081 5.85214C18.9152 6.14503 18.4403 6.14503 18.1474 5.85214C17.8545 5.55924 17.8545 5.08437 18.1474 4.79148L18.5402 4.39864C18.8331 4.10575 19.308 4.10575 19.6009 4.39864Z"
                            />
                            <path
                                d="M18.1474 18.1474C18.4403 17.8545 18.9152 17.8545 19.2081 18.1474L19.6009 18.5402C19.8938 18.8331 19.8938 19.308 19.6009 19.6009C19.308 19.8938 18.8331 19.8938 18.5402 19.6009L18.1474 19.2081C17.8545 18.9152 17.8545 18.4403 18.1474 18.1474Z"
                            />
                            <path
                                d="M5.85188 18.1477C6.14477 18.4406 6.14477 18.9154 5.85188 19.2083L5.45904 19.6012C5.16615 19.8941 4.69127 19.8941 4.39838 19.6012C4.10549 19.3083 4.10549 18.8334 4.39838 18.5405L4.79122 18.1477C5.08411 17.8548 5.55898 17.8548 5.85188 18.1477Z"
                            />
                        </g>
                    </svg>
    
                    <svg
                        slot="darkIcon"
                        class="w-[20px] h-[20px] md:w-[40px] md:h-[40px] fill-blue"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            opacity="0.5"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M22 12.0004C22 17.5232 17.5228 22.0004 12 22.0004C10.8358 22.0004 9.71801 21.8014 8.67887 21.4357C8.24138 20.3772 8 19.217 8 18.0004C8 15.7792 8.80467 13.7459 10.1384 12.1762C11.31 13.8818 13.2744 15.0004 15.5 15.0004C17.8615 15.0004 19.9289 13.741 21.0672 11.8572C21.3065 11.4612 22 11.5377 22 12.0004Z"
                        />
                        <path
                            d="M2 12C2 16.3586 4.78852 20.0659 8.67887 21.4353C8.24138 20.3768 8 19.2166 8 18C8 15.7788 8.80467 13.7455 10.1384 12.1758C9.42027 11.1303 9 9.86422 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12Z"
                        />
                    </svg>
                </DarkMode>
    
    
    
                <button
            on:click={handleSignOut}
            class="text-gray-700 bg-red-500 p-2 rounded-xl text-white hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
        >
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
            </svg>
            
        </button>
    </div>
    

</NavUl>
<div class="hidden md:flex  gap-2 justify-center items-center">
    

    <div
                class="w-auto h-10 rounded-lg bg-[#f1f1f1] dark:bg-blue flex justify-center items-center"
            >
                <Button
                    class="gap-2 flex bg-blue/60 dark:bg-transparent dark:hover:bg-transparent hover:bg-blue duration-300 ease-in-out"
                >
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img
                        class="w-6 h-6 object-cover rounded-full {$locale === 'en'
                            ? 'object-left'
                            : 'object-center'}"
                        src={$locale === 'en' ? '/images/usa.jpg' : '/images/kurdish.svg'}
                    />
                    {$locale === 'en' ? $_('english') : $_('kurdish')}
                    <ChevronDownOutline class="w-auto h-6 ms-2 text-white dark:text-white" />
                </Button>

                <Dropdown
                    class="w-48 overflow-y-auto py-1 h-auto z-50"
                    containerClass="bg-white/80 dark:bg-darkBlue/80 backdrop-blur-lg rounded-xl z-50"
                >
                    <DropdownItem
                        class="flex items-center text-base font-semibold gap-2 dark:text-white"
                        on:click={() => {
                            locale.set('en');
                            localStorage.setItem('lang', 'en');
                        }}
                    >
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <img class="w-8 h-8 object-cover rounded-full object-left" src="/images/usa.jpg" />{$_(
                            'english'
                        )}
                    </DropdownItem>
                    <DropdownItem
                        class="flex items-center text-base font-semibold gap-2 dark:text-white"
                        on:click={() => {
                            locale.set('ckb');
                            localStorage.setItem('lang', 'ckb');
                        }}
                    >
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <img class="w-8 h-8 object-cover rounded-full" src="/images/kurdish.svg" />{$_(
                            'kurdish'
                        )}
                    </DropdownItem>
                </Dropdown>
            </div>

            
            <DarkMode class="text-lg">
                <svg
                    class="w-[20px] h-[20px] md:w-[40px] md:h-[40px] fill-white"
                    slot="lightIcon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3C3.41421 11.25 3.75 11.5858 3.75 12C3.75 12.4142 3.41421 12.75 3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM20.25 12C20.25 11.5858 20.5858 11.25 21 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H21C20.5858 12.75 20.25 12.4142 20.25 12ZM12 20.25C12.4142 20.25 12.75 20.5858 12.75 21V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V21C11.25 20.5858 11.5858 20.25 12 20.25Z"
                    />
                    <g opacity="0.5">
                        <path
                            d="M4.39838 4.39838C4.69127 4.10549 5.16615 4.10549 5.45904 4.39838L5.85188 4.79122C6.14477 5.08411 6.14477 5.55898 5.85188 5.85188C5.55898 6.14477 5.08411 6.14477 4.79122 5.85188L4.39838 5.45904C4.10549 5.16615 4.10549 4.69127 4.39838 4.39838Z"
                        />
                        <path
                            d="M19.6009 4.39864C19.8938 4.69153 19.8938 5.16641 19.6009 5.4593L19.2081 5.85214C18.9152 6.14503 18.4403 6.14503 18.1474 5.85214C17.8545 5.55924 17.8545 5.08437 18.1474 4.79148L18.5402 4.39864C18.8331 4.10575 19.308 4.10575 19.6009 4.39864Z"
                        />
                        <path
                            d="M18.1474 18.1474C18.4403 17.8545 18.9152 17.8545 19.2081 18.1474L19.6009 18.5402C19.8938 18.8331 19.8938 19.308 19.6009 19.6009C19.308 19.8938 18.8331 19.8938 18.5402 19.6009L18.1474 19.2081C17.8545 18.9152 17.8545 18.4403 18.1474 18.1474Z"
                        />
                        <path
                            d="M5.85188 18.1477C6.14477 18.4406 6.14477 18.9154 5.85188 19.2083L5.45904 19.6012C5.16615 19.8941 4.69127 19.8941 4.39838 19.6012C4.10549 19.3083 4.10549 18.8334 4.39838 18.5405L4.79122 18.1477C5.08411 17.8548 5.55898 17.8548 5.85188 18.1477Z"
                        />
                    </g>
                </svg>

                <svg
                    slot="darkIcon"
                    class="w-[20px] h-[20px] md:w-[40px] md:h-[40px] fill-blue"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        opacity="0.5"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M22 12.0004C22 17.5232 17.5228 22.0004 12 22.0004C10.8358 22.0004 9.71801 21.8014 8.67887 21.4357C8.24138 20.3772 8 19.217 8 18.0004C8 15.7792 8.80467 13.7459 10.1384 12.1762C11.31 13.8818 13.2744 15.0004 15.5 15.0004C17.8615 15.0004 19.9289 13.741 21.0672 11.8572C21.3065 11.4612 22 11.5377 22 12.0004Z"
                    />
                    <path
                        d="M2 12C2 16.3586 4.78852 20.0659 8.67887 21.4353C8.24138 20.3768 8 19.2166 8 18C8 15.7788 8.80467 13.7455 10.1384 12.1758C9.42027 11.1303 9 9.86422 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12Z"
                    />
                </svg>
            </DarkMode>



            <button
        on:click={handleSignOut}
        class="text-gray-700 bg-red-500 p-2 rounded-xl text-white hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
    >
        <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
        </svg>
        
    </button>
</div>


  </Navbar>