import { PlaywrightAgent } from '@midscene/web/playwright';

interface OrderRecord {
  orderId: string;
  product: string;
  status: string;
}

interface CustomYamlStepContext {
  agent: PlaywrightAgent;
  state: Record<string, unknown>;
  filePath: string;
  stepIndex: number;
  stepName: string;
}

type CustomYamlStepHandler = (
  value: unknown,
  context: CustomYamlStepContext,
) => Promise<void> | void;

export interface MidsceneConfig {
  target: {
    type: 'web';
    options: {
      url: string;
      viewport: {
        width: number;
        height: number;
      };
      headless: boolean;
    };
  };
  testDir: string;
  include: string[];
  testRunner: {
    maxConcurrency: number;
    bail: number;
    testTimeout: number;
  };
  output: {
    summary: string;
  };
  agentOptions: {
    groupName: string;
    groupDescription: string;
    reportFileName: string;
    cache: boolean;
  };
  yamlSteps: Record<string, CustomYamlStepHandler>;
}

function defineMidsceneConfig(config: MidsceneConfig): MidsceneConfig {
  return config;
}

const orders = new Map<string, OrderRecord>();

function assertOrderRecord(value: unknown): OrderRecord {
  if (!value || typeof value !== 'object') {
    throw new Error('seedOrder expects an object value');
  }

  const record = value as Partial<OrderRecord>;
  if (
    typeof record.orderId !== 'string' ||
    typeof record.product !== 'string' ||
    typeof record.status !== 'string'
  ) {
    throw new Error('seedOrder requires string orderId, product, and status');
  }

  return {
    orderId: record.orderId,
    product: record.product,
    status: record.status,
  };
}

export default defineMidsceneConfig({
  target: {
    type: 'web',
    options: {
      url: process.env.DEMO_SITE_URL ?? 'http://127.0.0.1:3000/catalog.html',
      viewport: { width: 1280, height: 800 },
      headless: process.env.MIDSCENE_DEMO_HEADLESS !== 'false',
    },
  },

  testDir: './e2e',
  include: ['**/*.yaml'],

  testRunner: {
    maxConcurrency: 1,
    bail: 0,
    testTimeout: 120_000,
  },

  output: {
    summary: './midscene_run/output/summary.json',
  },

  agentOptions: {
    groupName: 'Custom YAML Steps',
    groupDescription:
      'Demo suite that mixes Midscene built-in YAML steps with project-defined YAML steps.',
    reportFileName: 'custom-yaml-steps-demo',
    cache: true,
  },

  yamlSteps: {
    async seedOrder(value, ctx) {
      const order = assertOrderRecord(value);
      orders.set(order.orderId, order);
      ctx.state.lastOrderId = order.orderId;
      console.log(`Seeded order ${order.orderId} for ${order.product}`);
    },

    async assertOrderStatus(value, ctx) {
      if (!value || typeof value !== 'object') {
        throw new Error('assertOrderStatus expects an object value');
      }

      const assertion = value as { orderId?: unknown; status?: unknown };
      const orderId =
        typeof assertion.orderId === 'string'
          ? assertion.orderId
          : (ctx.state.lastOrderId as string | undefined);
      if (!orderId || typeof assertion.status !== 'string') {
        throw new Error('assertOrderStatus requires orderId and status strings');
      }

      const order = orders.get(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} was not seeded`);
      }

      if (order.status !== assertion.status) {
        throw new Error(
          `Expected order ${orderId} to be ${assertion.status}, got ${order.status}`,
        );
      }

      console.log(`Verified order ${orderId} status ${order.status}`);
    },
  },
});
