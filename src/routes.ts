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
  fastify.post(
    "/users",
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          email: string;
          password: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const { name, email, password } = request.body;

      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password,
          },
        });

        // Nunca retorne a senha em um sistema real
        return reply.code(201).send({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        });
      } catch (err: any) {
        if (err?.code === "P2002") {
          return reply
            .code(400)
            .send({ message: "E-mail já está em uso." });
        }

        request.log.error(err);
        return reply
          .code(500)
          .send({ message: "Erro ao criar usuário." });
      }
    },
  );

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

  fastify.post(
    "/products",
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          description?: string;
          price: number;
          stock?: number;
          ownerId: number;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const { name, description, price, stock, ownerId } = request.body;

      const product = await prisma.product.create({
        data: {
          name,
          description: description ?? null,
          price,
          stock: stock ?? 0,
          owner: {
            connect: { id: ownerId },
          },
        },
      });

      return reply.code(201).send({ product });
    },
  );
}