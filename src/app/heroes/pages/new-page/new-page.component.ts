import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { filter, switchMap, tap } from 'rxjs';

import { HeroesService } from '../../services/heroes.service';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) {
      return;
    }
    this.activatedRoute.params
      //Lamar al service con el id de los params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');

        return this.heroForm.reset(hero); // Resetear el formulario y rellenarlo con hero
      });
  }

  onSubmit(): void {
    if (!this.heroForm.valid) return;
    //* Observables: Cualquier observable si no se suscribe, no se dispara.
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} Updated!`);
      });
      return;
    }
    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      this.showSnackbar(`${hero.superhero} Created!`);
      this.router.navigate(['/heroes/edit', hero.id]);
    });
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero id is required');

    // ConfirmDialogComponent es un componente en heroes/components
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.currentHero,
    });

    dialogRef
      .afterClosed()
      .pipe(
        //filter es como una barrera, si una condicion se cumple lo deja pasar en otro caso lo bloquea(no se ejecuta el subscribe)
        filter((result: boolean) => result), // si el result es verdadero ejecuta el switchMap
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)), //Regresa un true o false si fue eliminado
        filter((wasDeleted: boolean) => wasDeleted) // Barrera para ver si fue eliminado
      )
      .subscribe(() => {
        this.router.navigate(['/heroes', '/list']); // Si fue eliminado con exito
      });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (!result) return; // si es undefined o false

    //   this.heroesService
    //     .deleteHeroById(this.currentHero.id)
    //     .subscribe((wasDeleted) => {
    //       if (wasDeleted) this.router.navigate(['/heroes', '/list']);
    //     });
    // });
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }
}
