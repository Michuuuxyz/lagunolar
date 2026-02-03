import fs from 'fs';
import path from 'path';

interface Command {
  name: string;
  description: string;
  category: "Fun" | "Info" | "Moderation";
  usage?: string;
  permissions?: string[];
  aliases?: string[];
  cooldown?: number;
}

// Caminho para os comandos do bot Laguno
// IMPORTANTE: Em produção, use variável de ambiente BOT_COMMANDS_PATH
// Em desenvolvimento, tenta detectar automaticamente
const getBotCommandsPath = () => {
  if (process.env.BOT_COMMANDS_PATH) {
    return process.env.BOT_COMMANDS_PATH;
  }

  // Fallback para desenvolvimento local - tenta diferentes caminhos
  const possiblePaths = [
    path.join(__dirname, '../../../Laguno/src/commands'),  // De dist/utils/
    path.join(__dirname, '../../../../Laguno/src/commands'), // De src/utils/
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log(`[COMMAND PARSER] ✅ Comandos encontrados em: ${testPath}`);
      return testPath;
    }
  }

  console.warn('[COMMAND PARSER] ⚠️ BOT_COMMANDS_PATH não configurado. Configure a variável de ambiente.');
  return '';
};

const BOT_COMMANDS_PATH = getBotCommandsPath();

/**
 * Lê e parseia todos os comandos do bot
 */
export async function getAllCommands(): Promise<Command[]> {
  const commands: Command[] = [];

  // Se BOT_COMMANDS_PATH estiver vazio, retornar lista vazia (produção)
  if (!BOT_COMMANDS_PATH) {
    return commands;
  }

  const categories = ['Fun', 'Info', 'Moderation'];

  for (const category of categories) {
    const categoryPath = path.join(BOT_COMMANDS_PATH, category);

    // Verificar se a pasta existe
    if (!fs.existsSync(categoryPath)) {
      continue; // Silenciar warning em produção
    }

    const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
      try {
        const filePath = path.join(categoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Parse básico do comando
        const command = parseCommandFile(fileContent, category);
        if (command) {
          commands.push(command);
        }
      } catch (error) {
        console.error(`Erro ao ler comando ${file}:`, error);
      }
    }
  }

  return commands;
}

/**
 * Parseia o conteúdo de um arquivo de comando
 */
function parseCommandFile(content: string, category: string): Command | null {
  try {
    // Extrair informações usando regex
    const nameMatch = content.match(/name:\s*["'](.+?)["']/);
    const descMatch = content.match(/description:\s*["'](.+?)["']/);
    const aliasesMatch = content.match(/aliases:\s*\[(.*?)\]/);
    const cooldownMatch = content.match(/cooldown:\s*(\d+)/);
    const userPermsMatch = content.match(/userPermissions:\s*\[(.*?)\]/);

    if (!nameMatch || !descMatch) {
      return null;
    }

    const command: Command = {
      name: nameMatch[1],
      description: descMatch[1],
      category: category as "Fun" | "Info" | "Moderation",
    };

    // Aliases
    if (aliasesMatch && aliasesMatch[1].trim()) {
      command.aliases = aliasesMatch[1]
        .split(',')
        .map(a => a.trim().replace(/['"]/g, ''))
        .filter(a => a);
    }

    // Cooldown
    if (cooldownMatch) {
      command.cooldown = parseInt(cooldownMatch[1]);
    }

    // Permissões (mapear userPermissions para permissions para compatibilidade com frontend)
    if (userPermsMatch && userPermsMatch[1].trim()) {
      command.permissions = userPermsMatch[1]
        .split(',')
        .map(p => p.trim().replace(/PermissionFlagsBits\./g, ''))
        .filter(p => p);
    }

    // Tentar extrair usage do SlashCommandBuilder
    const usageMatch = extractUsageFromCommand(content, command.name);
    if (usageMatch) {
      command.usage = usageMatch;
    }

    return command;
  } catch (error) {
    console.error('Erro ao parsear comando:', error);
    return null;
  }
}

/**
 * Extrai informação de uso do SlashCommandBuilder
 */
function extractUsageFromCommand(content: string, commandName: string): string | undefined {
  // Procurar por opções do SlashCommandBuilder
  const hasOptions = content.includes('addStringOption') ||
                     content.includes('addUserOption') ||
                     content.includes('addIntegerOption') ||
                     content.includes('addBooleanOption');

  if (!hasOptions) {
    return undefined;
  }

  // Extrair nomes das opções
  const optionMatches = content.matchAll(/\.setName\(["'](.+?)["']\)/g);
  const options: string[] = [];

  for (const match of optionMatches) {
    // Pular o nome do comando principal
    if (match[1] !== commandName) {
      const isRequired = content.includes(`setName("${match[1]}")`) &&
                        content.includes('.setRequired(true)');
      options.push(isRequired ? `[${match[1]}]` : `(${match[1]})`);
    }
  }

  if (options.length > 0) {
    return `/${commandName} ${options.join(' ')}`;
  }

  return undefined;
}

/**
 * Obtém comandos por categoria
 */
export async function getCommandsByCategory(): Promise<Record<string, Command[]>> {
  const allCommands = await getAllCommands();

  return allCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);
}
