import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';
import { GetEvaluacionService } from '../Get/getEvaluacion.service';

@Injectable()
export class UpdateEvaluacionService {
  constructor(
    private readonly getEvaluacionService: GetEvaluacionService,
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
  ) {}

  // Solo existen 2 opciones: se actualizan los datos de la evaluacion o el ID de la matrícula
  async updateEvaluacion(
    id: number,
    newData: Partial<EvaluacionDb>,
    matricula?: MatriculaDb,
  ): Promise<EvaluacionDb> {
    try {
      // OBTENGO LA MATRICULA A ACTUALIZAR A PARTIR DE SU ID
      // const evaluacionToUpdate =
      //   await this.getEvaluacionService.getEvaluacion(id);

      const evaluacionToUpdate = await this.evaluacionRepository.findOne({
        where: { id },
      });

      // OBTENGO LA NUEVA MATRICULA A ASIGNAR
      if (matricula) {
        const newMatricula = await this.matriculaRepository.findOne({
          where: {
            id: matricula.id,
          },
        });
        evaluacionToUpdate.matricula = newMatricula;
      }

      const updatedEvaluacion = await this.evaluacionRepository.merge(
        evaluacionToUpdate,
        newData,
      );

      return this.evaluacionRepository.save(updatedEvaluacion);
    } catch (error) {
      console.error('Error al actualizar la evaluacion:', error);
      throw new Error('No se pudo actualizar la evaluacion');
    }
  }
}
