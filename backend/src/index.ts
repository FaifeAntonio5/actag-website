// src/index.ts
import express    from 'express';
import cors       from 'cors';
import dotenv     from 'dotenv';

import authRoutes        from './routes/auth.routes';
import membrosRoutes     from './routes/membros.routes';
import voluntariosRoutes from './routes/voluntarios.routes';
import doadoresRoutes    from './routes/doadores.routes';
import contactoRoutes    from './routes/contacto.routes';
import doacaoRoutes      from './routes/doacao.routes';
import noticiasRoutes    from './routes/noticia.routes';
import galeriaRoutes     from './routes/galeria.routes';
import blogRoutes        from './routes/blog.routes';
import informativoRoutes  from './routes/informativo.routes';
import projectosRoutes   from './routes/projetos.routes';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Rota de saúde
app.get('/', (_req, res) => {
  res.json({ mensagem: 'API Associação Tagumanicanave activa ✓' });
});

// Rotas
app.use('/api/auth',        authRoutes);
app.use('/api/membros',     membrosRoutes);
app.use('/api/newsletter', informativoRoutes);
app.use('/api/voluntarios', voluntariosRoutes);
app.use('/api/doadores',    doadoresRoutes);
app.use('/api/contacto',    contactoRoutes);
app.use('/api/doacoes',     doacaoRoutes);
app.use('/api/noticias',    noticiasRoutes);
app.use('/api/galeria',     galeriaRoutes);
app.use('/api/blog',        blogRoutes);
app.use('/api/projectos',   projectosRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
});