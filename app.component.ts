// Taller de Inteligencia Artificial

// Presentado por:
// * Melissa Aldana Zapataz
// * Jose Andrés Suárez Espinal

// Politécnico Jaime Isaza Cadavid

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'algoritmo-genetico';

  cargando = false
  cadena = ''
  populationSize: number = 500;
  pressure: number = 15;
  mutationChance: number = 0.8;
  resultado: any = []



  createIndividual() {
    return this.generateRandomString(this.cadena.length)
  }

  createPopulation() {
    let population = []
    for (let i = 0; i < +this.populationSize; i++) {
      population.push(this.createIndividual())
    }
    return population
  }

  fitnessValue(individual) {
    let fitness = 0
    Array.prototype.forEach.call(individual, (char, idx) => {
      if (char === this.cadena[idx]) {
        fitness++
      }
    })
    return fitness / this.cadena.length
  }

  selectForReproduction(population) {

    let puntuados = []

    population.forEach(individual => {
      puntuados.push({
        fitness: this.fitnessValue(individual),
        individual: individual
      })
    });

    puntuados.sort((a, b) => (a.fitness > b.fitness) ? -1 : ((b.fitness > a.fitness) ? 1 : 0))

    const selected = puntuados.slice(0, this.pressure)

    for (let i = this.pressure; i < this.populationSize; i++) {
      let punto = Math.floor(Math.random() * (this.cadena.length));
      let padre1 = Math.floor(Math.random() * this.pressure);
      let padre2 = Math.floor(Math.random() * this.pressure);
      while (padre1 === padre2) {
        padre2 = Math.floor(Math.random() * this.pressure);
      }
      puntuados[i].individual = String.prototype.concat(selected[padre1].individual.substr(0, punto), selected[padre2].individual.substr(punto, this.cadena.length))
    }
    population = puntuados.map(ind => {
      return ind.individual
    })

    return population
  }


  setMutation(population) {

    for (let i = this.pressure; i < this.cadena.length; i++) {
      if (Math.random() <= this.mutationChance) {
        let punto = Math.floor(Math.random() * (this.cadena.length));
        let nuevoValor = this.generateRandomChar()
        while (population[i][punto] === nuevoValor) {
          nuevoValor = this.generateRandomChar()
        }

        population[i] = `${population[i].substr(0, punto)}${nuevoValor}${population[i].substr(punto + 1, this.cadena.length)}`
      }
    }
    return population
  }

  generateRandomString = (num) => {

    let result = '';
    for (let i = 0; i < num; i++) {
      result += this.generateRandomChar()
    }
    return result;
  }

  generateRandomChar() {
    const characters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyzáéíóú '
    return characters.charAt(Math.floor(Math.random() * characters.length))
  }

  generateString() {
    this.cargando = true
    this.resultado = []
    let population = this.createPopulation()
    let generation = 0
    while (this.fitnessValue(population[0]) !== 1 && generation < 5000) {
      population = this.selectForReproduction(population)
      population = this.setMutation(population)
      if (generation % 50 === 0) {
        this.resultado.push({
          generation: generation,
          fitness: this.fitnessValue(population[0]),
          individual: population[0]
        })
      }
      generation++;
    }

    this.resultado.push({
      generation: generation,
      fitness: this.fitnessValue(population[0]),
      individual: population[0]
    })
    this.cargando = false


  }
}
