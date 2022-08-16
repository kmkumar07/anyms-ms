
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation
   * This command will install all modules listed as dependencies in package.json
   
       ```
         npm install
       ```
       ```
         npm install --force
       ```

## Running the app
 ### Development:
   * without dapr
       ```
         npm run start
       ```

  * Use this command for dapr running as a sidecar
       ```
         dapr run --app-id nest-main-application --components-path ./dapr/components -- npm run start
       ```
### Watch mode:
   * Use this command to run the app in watch mode.
   
       ```
         npm run start:dev
       ```
### Production mode:
   * Use this command to run the app in production mode.
   
       ```
         npm run start:prod
       ```

##  Migration
* Migrations are used to create or alter the table model in a database.
 
### Create a Migration
   * It makes template for your new migration.Create does not really do any database sync.
   
       ```
         npm run migration:create <name>
       ```
  
### Generate a Migration

   *  Generate migration files with model changes you made.
   
       ```
         npm run migration:generate <name>
       ```

### Run Migration
   * Use this command to run the migration
   
       ```
         npm run migration
       ```

## Run seed
   * Seeders can be used to pre-populate your DB tables with fake data.
   
       ```
         npm run seed
       ```
# Run swagger       
* Swagger UI allows you to visualize and interact with the API’s resources without having any of the implementation logic in place.
       ```
         http://localhost:4201/AppRoutePrefix/api
       ```
    ### Example:
        
         http://localhost:4201/identity/api
        
## Test

   * Use this command to run the unit tests
   
       ```
         npm run test
       ```
   * Use this command to run the e2e tests
       ```
         npm run test:e2e
       ```
   * Use this command to run the test coverage

       ```
         npm run test:cov
       ```

    
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
