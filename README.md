# Schnupons

A puppeteer script that handles tedium around online coupons at my local grocer.

## Background

Our grocer offers online coupons. To use them, you present a barcode at checkout, and it applies all relevant coupons from towards whatever you're buying. On any given day, there's 150+ coupons available, and most of them aren't relevant. I don't want to scroll through them all to figure out if there's anything I need.

This little script logs in, "clips" every single coupon available, then exits.

## Requirements

- Node 10.15.1 or later.
- A [Schnucks](https://nourish.schnucks.com/) account

## Install

From the project directory, install and symlink the binary:

```
npm ci && npm link
```

For updates:

```
git pull && npm ci
```

## Usage

```
Usage: schnupons [options]

Options:
  -V, --version              output the version number
  -u, --username <username>  Your account username
  -p, --password <password>  Your account password
  -h, --help                 output usage information
```

## Example

```
# in cron, in docker, or wherever
schnupons --username YOUR_USERNAME --password YOUR_PASSWORD
```
