export class GetMatriculaDto {
  id: number;
  student: {
    id: number;
    usuario_id: string;
    nombre: string;
    apellidos: string;
    dni: string;
    direccion: string;
    telefono: number;
    email: string;
  };
  subject: {
    id: number;
    nombre: string;
  };
  teacher: {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    asignaturas: string | null; // AÑADIR UN ARRAY DE ASIGNATURAS QUE IMPARTE
  };
}
