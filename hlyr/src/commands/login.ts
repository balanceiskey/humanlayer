import chalk from 'chalk'
import readline from 'readline'
import { spawn } from 'child_process'
import { loadConfigFile, saveConfigFile, getDefaultConfigPath } from '../config.js'

interface LoginOptions {
  apiBase?: string
  appBase?: string
  configFile?: string
}

export async function loginCommand(options: LoginOptions): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (prompt: string): Promise<string> => {
    return new Promise(resolve => {
      rl.question(prompt, resolve)
    })
  }

  try {
    // Load existing config if config file flag is set
    const existingConfig = options.configFile ? loadConfigFile(options.configFile) : { channel: {} }

    const appUrl =
      options.appBase ||
      existingConfig.app_base_url ||
      process.env.HUMANLAYER_APP_URL ||
      'https://app.humanlayer.dev'
    const loginUrl = `${appUrl}/cli-login`

    console.log(chalk.blue('HumanLayer Login'))

    // Try to open the URL in the default browser
    const openBrowser = async (url: string) => {
      const platform = process.platform
      let command: string

      if (platform === 'darwin') {
        command = 'open'
      } else if (platform === 'win32') {
        command = 'start'
      } else {
        command = 'xdg-open'
      }

      try {
        spawn(command, [url], { detached: true, stdio: 'ignore' }).unref()
        console.log(chalk.green('Opening browser...'))
      } catch (error) {
        console.log(chalk.yellow(`Could not open browser automatically: ${error}`))
        console.log(chalk.gray(`To get your API token, visit: ${loginUrl}`))
      }
    }

    const browserPrompt = await question(
      'Press Enter to open in default browser or ESC to continue manually: ',
    )
    if (browserPrompt !== '\u001b') {
      // ESC key
      await openBrowser(loginUrl)
    }
    console.log('')

    const token = await question('Paste your API token: ')

    if (!token.trim()) {
      console.error(chalk.red('Error: No token provided'))
      process.exit(1)
    }

    const configPath = options.configFile || getDefaultConfigPath()
    console.log(chalk.yellow(`Token will be written to: ${configPath}`))

    const proceed = await question('Continue? (y/N): ')
    if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
      console.log(chalk.gray('Login cancelled'))
      process.exit(0)
    }

    // Validate token by making a request to /me endpoint
    // TODO: NOT WORKING ATM, need to fix this
    // const apiBaseUrl = options.apiBase || existingConfig.api_base_url || process.env.HUMANLAYER_API_BASE_URL || 'https://api.humanlayer.dev'

    // console.log("apiBaseUrl", apiBaseUrl)
    // try {
    //   console.log(chalk.blue('Validating token...'))
    //   const response = await fetch(`${apiBaseUrl}/me`, {
    //     headers: {
    //       'Authorization': `Bearer ${token.trim()}`
    //     }
    //   })

    //   if (!response.ok) {
    //     throw new Error(`Token validation failed: ${response.statusText}`)
    //   }

    //   const userData = await response.json()
    //   console.log(chalk.green(`Token validated successfully! Logged in as: ${userData.email || 'Unknown'}`))
    // } catch (error) {
    //   console.error(chalk.red(`Token validation failed: ${error}`))
    //   process.exit(1)
    // }

    const newConfig = {
      ...existingConfig,
      api_token: token.trim(),
      api_base_url: options.apiBase || existingConfig.api_base_url || 'https://api.humanlayer.dev',
      app_base_url: appUrl,
    }

    saveConfigFile(newConfig, options.configFile)
    console.log(chalk.green('Login successful!'))
  } catch (error) {
    console.error(chalk.red(`Error during login: ${error}`))
    process.exit(1)
  } finally {
    rl.close()
  }
}
