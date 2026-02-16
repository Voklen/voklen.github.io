---
layout: ../../layouts/BlogPostLayout.astro
title: 'Government ID System'
date: 2026-02-16
description: 'My proposal for a better way of verifying ID'
tags: ["politics", "government", "id"]
---

# Introduction
In discussions about online services requiring ID verification, there are usually two sides with one claiming “There’s so much misinformation, AI slop and dictatorship-funded state actors influencing public opinion on social media, we need some way to verify people!” while the other claiming “Anonymity is essential for whistle-blowers, people living in oppressive governments and even if you’re neither of these it means everything you ever say can be tied back to you. We cannot allow identity verification!” I can see both sides of this argument but I believe in certain situations such as opening a bank account or putting a property on Airbnb (where ID verification is already required today) do have a genuine reason to verify your ID. But I think the current process is inadequate and can be improved. 

# Issue with the current system
Right now, the current system of identity verification that you’ll see out in the wild will usually consist of “Take a picture of your ID, then take a picture of yourself” and I believe this has a few problems:

First of all, it’s repeatable, so if someone gets access to these two photos then they can use it to “verify” your identity on any website. Secondly, who verifies these photos? It’s either the website themselves or (more likely) a third party. Afterwards are these images deleted? If so that’s good but if they’re ever audited they can’t really prove that they really did verify you beyond “trust me bro”. If they do keep these images then if/when this company is hacked, suddenly your identity can be used by criminals and we get back to the problem of just possessing these images let’s you “verify” that you are someone. Finally, How does the verifier know that the ID is real? Well looking at the website of [Yoti](https://www.yoti.com/) (who’s software I’ve encountered quite a few times during ID checks) their [identity verification offering](https://www.yoti.com/business/identity-verification/) claims to:
> Ensure documents are genuine with AI-led authenticity checks. If required, you can also leverage our team of over 200 verification experts.

And then they cross reference the data with credit rating agencies and government specific services such as the Australian Government’s Document Verification Service. This seems reasonable, but if the government has a Document Verification Service, they can know every single website you verify with, and if you don’t have this system, you’re just relying on judging if an ID is real with the same accuracy as a bouncer at the bar through shiny stickers and refractive coatings on the ID.

# My proposal
My proposal is to build a system using cryptographic key signing. We have to be quite careful with “just use public-private key crypto” solutions because if not implemented carefully, can be unrecoverable and people loose things, forget passwords and drop their devices into rivers without having any backups (Aside: this is the main reason why I think cryptocurrencies are not viable as a replacement for the current financial system, but that's for a different day). My proposal begins with the government having it’s own master public and private key. Then, each individual citizen has a public-private keypair assigned to them. The public key of every citizen is signed by the government’s key to confirm that this public key is indeed linked to an individual person in the country.

Next, every person is given a _physical_ ID card, not a digital one. This ID card will essentially act as a [Yubikey](https://www.yubico.com/) through NFC (in fact Yubikeys already support NFC, so the technology already exists) which can sign requests with the individual’s private key. This private key is only on the card and not stored anywhere else which makes it significantly harder to steal this identity. The card should also have security features which make it very difficult to physically extract the private key off the card.

If the physical card is lost or stolen, the person can go to their nearest government building and apply for a new one. When the government is signing this newly generated key pair, they’ll also sign a message saying that the previous public key is no longer valid.

So how do websites use this? Well there are two reasons a website might want identity verification: The first is to prevent spam or comply with regulation: they want to know you are **a** person signing up but they don’t care **who** you are. The other is that you’re signing up for something in your name like a bank account and they do want to verify that it is really you who is performing this action.

Let’s start with the former.

## Verifying you’re a person

The government can provide an API endpoint with all the currently signed public keys with their signatures and a service (such as a social media company or VPS provider) can download and quickly verify each of the signatures. There can also be an endpoints to get rejected keys and maybe a `?from-date=2025-12-04` option to get all the changes after a certain date for convenience. Regardless, the important thing is even if the API goes down, companies can still download this list from third-party websites and as long as they know the government’s public key, can verify the legitimacy of all the keys.

Once a service has this list of public keys, when a user registers with them it can request for the user to sign the domain name of the website, a unique “user id” and an expiry time with their key. The user’s browser has to support this protocol which then requests the users devices to get them to tap their government ID on an NFC supporting part of their device. Since phones already support NFC, this can already be supported with just a software change and all you’ll have to do is tap your ID card on the back. For desktops and laptops, a cheap USB adaptor should do the trick.

## Verifying you’re a specific person

Consider how banks currently operate. You open a bank account in your name… except many people probably have the same name as you. That’s okay, banks can have an account number assigned to you. Well with this system, when they verify your identity, they can say that the account belongs to a specific public key and ask you to enter your name and date of birth an other information separately. Then to verify you’ve entered the correct information they can check this against a government ID system similar to Australia’s DVA. This will mean the government knows when you sign up to a bank, but that’s okay because I don’t think it’s a problem for the government to know about new bank or investment accounts since you often have to declare financial activities for tax purposes anyway. I think only financial institutions need this feature because even if a VPS provider is requesting ID to prevent abuse, if they want to report anything to the government they can simply send your public key to them and the government knows who you are from this. Therefore, to prevent this specific part of the system for being used by social media companies or anyone else, it should be exclusive to financial institutions.

# Closing notes
One issue with this proposal is the possibility of the government’s private key being compromised. My solution is to have multiple keypairs distributed around the country (one in London, Manchester, Edinburgh, etc.). An ID must be signed by all of these to make it valid. A new pubic key is simply sent over the internet to each of these cities for them to sign it and the actual signing is done on air-gapped machines. This makes it incredibly difficult to somehow obtain all private keys of all the machines without getting caught doing it to a single one. Each machine should also be different in as many ways as possible (Hardware, OS, etc.) so even if an exploit is found in any machine, the others should not have it.

Finally, a note on half measures. I think even if there are some issues with this system, or if a watered down version of this idea becomes a proposal for legislation, we shouldn’t reject it because it’s not perfect. Even a partially flawed system is still better than what we have now and would improve the convenience, security and privacy of everyone in the country.
