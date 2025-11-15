import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'DropSpot API',
    version: '1.0.0',
    description: 'DropSpot - Sınırlı Stok ve Bekleme Listesi Platformu API Dokümantasyonu',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'] },
        },
      },
      Drop: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          total_stock: { type: 'integer' },
          claim_window_start: { type: 'integer' },
          claim_window_end: { type: 'integer' },
          waitlist_count: { type: 'integer' },
          claimed_count: { type: 'integer' },
          available_stock: { type: 'integer' },
          is_claim_window_open: { type: 'boolean' },
        },
      },
      Claim: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          drop_id: { type: 'integer' },
          claim_code: { type: 'string' },
          claimed_at: { type: 'integer' },
        },
      },
    },
  },
  paths: {
    '/auth/signup': {
      post: {
        summary: 'Yeni kullanıcı kaydı oluşturur',
        description: 'Sistemde yeni bir kullanıcı hesabı oluşturur. Email ve şifre ile kayıt yapılır. Şifre bcrypt ile hash\'lenerek saklanır. Başarılı kayıt sonrası JWT token döner (7 gün geçerli).',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', minLength: 6, example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Kullanıcı başarıyla oluşturuldu',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '409': { description: 'Email zaten sistemde kayıtlı' },
          '400': { description: 'Validation hatası' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Kullanıcı girişi yapar ve JWT token döner',
        description: 'Kayıtlı kullanıcının email ve şifresi ile giriş yapmasını sağlar. Şifre kontrolü bcrypt ile yapılır. Başarılı girişte JWT token döner. Token, diğer protected endpoint\'lerde Authorization header\'ında kullanılır.',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Giriş başarılı, JWT token döner',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '401': { description: 'Geçersiz email veya şifre' },
        },
      },
    },
    '/drops': {
      get: {
        summary: 'Aktif drop\'ların listesini getirir',
        description: 'Claim window\'u henüz bitmemiş tüm drop\'ları listeler. Her drop için waitlist sayısı, claim edilen sayı ve mevcut stok bilgisi döner. Authentication gerekmez, herkese açık endpoint.',
        tags: ['Drops'],
        responses: {
          '200': {
            description: 'Drop listesi başarıyla döndü',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    drops: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Drop' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/drops/{id}/join': {
      post: {
        summary: 'Bir drop\'un waitlist\'ine katılır',
        description: 'Kullanıcıyı seçilen drop\'un bekleme listesine ekler. Priority score hesaplanır (seed-based algoritma kullanır): Account age, Signup latency, Rapid actions kontrolü. İşlem idempotent\'tir - aynı kullanıcı tekrar join ederse 200 döner. Claim window başlamadan önce join edilebilir.',
        tags: ['Drops'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Drop ID',
          },
        ],
        responses: {
          '201': { description: 'Waitlist\'e başarıyla katıldı, priority score hesaplandı' },
          '200': { description: 'Kullanıcı zaten waitlist\'te (idempotent response)' },
          '401': { description: 'Authentication token gerekli veya geçersiz' },
          '404': { description: 'Drop bulunamadı' },
          '400': { description: 'Claim window bitmiş, join edilemez' },
        },
      },
    },
    '/drops/{id}/leave': {
      post: {
        summary: 'Waitlist\'ten ayrılır',
        description: 'Kullanıcıyı drop\'un waitlist\'inden çıkarır. Claim window başladıktan sonra leave yapılamaz. Kullanıcı waitlist\'te değilse 404 döner.',
        tags: ['Drops'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Drop ID',
          },
        ],
        responses: {
          '200': { description: 'Waitlist\'ten başarıyla ayrıldı' },
          '401': { description: 'Authentication token gerekli' },
          '404': { description: 'Kullanıcı waitlist\'te değil veya drop bulunamadı' },
          '400': { description: 'Claim window başladı, artık ayrılamaz' },
        },
      },
    },
    '/drops/{id}/claim': {
      post: {
        summary: 'Drop\'u claim eder ve unique claim code üretir',
        description: 'Claim window açıkken (start <= now <= end) kullanıcı drop\'u claim edebilir. Ön koşullar: 1. Kullanıcı waitlist\'te olmalı, 2. Claim window açık olmalı, 3. Yeterli stok olmalı, 4. Priority score\'a göre sıra gelmiş olmalı. Başarılı claim\'de 32 karakterlik unique claim code üretilir. İşlem transaction içinde yapılır, idempotent\'tir.',
        tags: ['Drops'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Drop ID',
          },
        ],
        responses: {
          '201': {
            description: 'Claim başarılı, claim code döner',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    claim: { $ref: '#/components/schemas/Claim' },
                  },
                },
              },
            },
          },
          '200': { description: 'Kullanıcı zaten bu drop\'u claim etmiş (idempotent)' },
          '400': { description: 'Claim window açık değil' },
          '401': { description: 'Authentication token gerekli' },
          '403': { description: 'Kullanıcı waitlist\'te değil' },
          '404': { description: 'Drop bulunamadı' },
          '409': { description: 'Stok tükendi veya priority score yeterli değil' },
        },
      },
    },
    '/admin/drops': {
      get: {
        summary: 'Tüm drop\'ları listeler (Admin only)',
        description: 'Admin kullanıcılar için tüm drop\'ları (aktif/pasif fark etmeksizin) listeler. Her drop için detaylı istatistikler döner: Waitlist sayısı, Claim edilen sayı, Mevcut stok. Sadece admin role\'üne sahip kullanıcılar erişebilir.',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Drop listesi başarıyla döndü' },
          '401': { description: 'Authentication token gerekli veya geçersiz' },
          '403': { description: 'Admin yetkisi gerekli' },
        },
      },
      post: {
        summary: 'Yeni drop oluşturur (Admin only)',
        description: 'Admin kullanıcı yeni bir drop oluşturur. Title zorunlu, Total stock pozitif integer olmalı, Claim window start/end Unix timestamp olarak verilmeli, End time start time\'dan sonra olmalı. Validation Zod ile yapılır.',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'total_stock', 'claim_window_start', 'claim_window_end'],
                properties: {
                  title: { type: 'string', example: 'Limited Edition Sneakers' },
                  description: { type: 'string', example: 'Exclusive sneaker drop' },
                  total_stock: { type: 'integer', minimum: 1, example: 100 },
                  claim_window_start: { type: 'integer', example: 1735689600 },
                  claim_window_end: { type: 'integer', example: 1735776000 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Drop başarıyla oluşturuldu' },
          '400': { description: 'Validation hatası' },
          '403': { description: 'Admin yetkisi gerekli' },
        },
      },
    },
    '/admin/drops/{id}': {
      put: {
        summary: 'Mevcut drop\'u günceller (Admin only)',
        description: 'Admin kullanıcı drop bilgilerini güncelleyebilir. Total stock, zaten claim edilen miktardan az olamaz. Tüm alanlar validation\'dan geçmeli. Updated_at timestamp otomatik güncellenir.',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Güncellenecek drop ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'total_stock', 'claim_window_start', 'claim_window_end'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  total_stock: { type: 'integer' },
                  claim_window_start: { type: 'integer' },
                  claim_window_end: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Drop başarıyla güncellendi' },
          '400': { description: 'Validation hatası veya stock kısıtlaması' },
          '403': { description: 'Admin yetkisi gerekli' },
          '404': { description: 'Drop bulunamadı' },
        },
      },
      delete: {
        summary: 'Drop\'u siler (Admin only)',
        description: 'Admin kullanıcı drop\'u sistemden siler. CASCADE delete çalışır: Drop silinince waitlist kayıtları silinir, Claim kayıtları silinir. Dikkat: Bu işlem geri alınamaz!',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
            description: 'Silinecek drop ID',
          },
        ],
        responses: {
          '200': { description: 'Drop ve ilişkili kayıtlar başarıyla silindi' },
          '403': { description: 'Admin yetkisi gerekli' },
          '404': { description: 'Drop bulunamadı' },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
