import { Post } from "../api/types";

export default function PostDetails({ post }: { post: Post }) {
  return (
    <div className="p-4">
      <div className="mb-4 p-4 border-2 border-red-400 bg-red-50 rounded">
        <h1 className="text-3xl font-extrabold text-red-700">
          À développer — Exemples
        </h1>
        <p className="text-sm text-red-600 mt-1">
          Ce composant est à développer ; ceci est juste un exemple.
        </p>
      </div>
      <h1 className="text-2xl font-bold mb-4">Détails du post</h1>

      <div className="space-y-2">
        <p>ID : {post.id ?? "—"}</p>
        {post.title && <p>Titre : {post.title}</p>}
        {post.description && <p>Contenu : {post.description}</p>}
        {post.author && (
          <p>
            Auteur : {post.author?.firstName} {post.author?.lastName}
          </p>
        )}
      </div>

      <h2 className="mt-4 font-medium">Données brutes</h2>
      <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
        {JSON.stringify(post, null, 2)}
      </pre>
    </div>
  );
}
