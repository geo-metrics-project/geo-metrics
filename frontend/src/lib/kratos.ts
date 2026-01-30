import { Configuration, FrontendApi } from "@ory/client"

export const kratosClient = new FrontendApi(
  new Configuration({ 
    basePath: process.env.NEXT_PUBLIC_KRATOS_URL || "https://kratos.combaldieu.fr",
    baseOptions: { 
      withCredentials: true 
    }
  })
)