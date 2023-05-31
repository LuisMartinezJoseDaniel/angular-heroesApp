import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage',
})
export class HeroImagePipe implements PipeTransform {
  transform(hero: Hero): string {
    // si no existe el id del hero (nombre de la imagen) retornar la imagen por defecto
    if (!hero.id && !hero.alt_img) return 'assets/no-image.png';

    if (hero.alt_img) return hero.alt_img; // url en la web como cloudinary

    return `assets/heroes/${hero.id}.jpg`;
  }
}
