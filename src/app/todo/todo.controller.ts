import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseUUIDPipe, 
    Post, 
    Put,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from 'src/helpers/Swagger/bad-request.swagger';
import { NotFoundSwagger } from 'src/helpers/Swagger/not-found.swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update.todo.dto';
import { CreateTodoSwagger } from './swagger/create-todo-swagger';
import { IndexTodoSwagger } from './swagger/index-todos.swagger';
import { ShowTodoSwagger } from './swagger/show-todo-swagger';
import { UpdateTodoSwagger } from './swagger/update-todo.swagger';
import { TodoService } from './todo.service';

@Controller('api/v1/todos')
@ApiTags('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService){}

    @Get()
    @ApiOperation({ summary: 'Listar todas as tarefas'})
    @ApiResponse({
        status: 200, 
        description: 'Lista de tarefas retornada com sucesso',
        type: IndexTodoSwagger,
        isArray: true,
    })
    async index() {
        return await this.todoService.findAll()
    }
    @Post()
    @ApiOperation({ summary: 'Adicionar uma nova tarefa'})
    @ApiResponse({
        status: 201, 
        description: 'Nova Tarefa criada com sucesso',
        type: CreateTodoSwagger,
    })
    @ApiResponse({
        status: 400, 
        description: 'Parâmentros inválidos', 
        type: BadRequestSwagger
    })
    async create(@Body() body: CreateTodoDto) {
        return await this.todoService.create(body)
    }
    @Get(':id')
    @ApiOperation({ summary: 'Exibir os dados de uma tarefa'})
    @ApiResponse({
        status: 200, 
        description: 'Dados de uma tarefa retornados com sucesso',
        type: ShowTodoSwagger,
    })
    @ApiResponse({
        status: 404, 
        description: 'Task não foi encontrada',
        type: NotFoundSwagger,
    })
    async show(@Param('id', new ParseUUIDPipe()) id: string) {
        return await this.todoService.findOneOrFail(id)
    }
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar os dados de uma tarefa'})
    @ApiResponse({
        status: 200, 
        description: 'Tarefa atualizada com sucesso',
        type: UpdateTodoSwagger,
    })
    @ApiResponse({
        status: 400,
        description: 'Dados invalidos', 
        type: BadRequestSwagger
        })
    @ApiResponse({
        status: 404, 
        description: 'Task não foi encontrada', 
        type: NotFoundSwagger
    })
    async update(
        @Param('id', new ParseUUIDPipe()) id: string, 
        @Body() body: UpdateTodoDto) {
        return await this.todoService.update(id, body)
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Remover uma tarefa'})
    @ApiResponse({
        status: 204, 
        description: 'Tarefa removida com sucesso'
    })
    @ApiResponse({
        status: 404, 
        description: 'Task não foi encontrada',
        type: NotFoundSwagger,
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
        await this.todoService.deleteById(id)
    }

}
