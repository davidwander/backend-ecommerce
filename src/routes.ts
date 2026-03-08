import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import prisma from "./prisma.js";

export async function routes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  fastify.get(
    "/teste",
    async (_request: FastifyRequest, _reply: FastifyReply) => {
      return { ok: true };
    },
  );

  fastify.get(
    "/products",
    async (_request: FastifyRequest, _reply: FastifyReply) => {
      const products = await prisma.product.findMany();
      return { products };
    },
  );
}