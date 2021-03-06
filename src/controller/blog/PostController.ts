import {PostRepository} from "../../repository/blog/PostRepository";
import {getCustomRepository} from "typeorm";
import {CustomRequest} from "../../middleware";
import {NextFunction, Response} from "express";

export class PostController {
  constructor() {
  }
  
  private repository = getCustomRepository(PostRepository);
  
  async getListMine(request: CustomRequest, response: Response, next: NextFunction) {
    const pageSize = Number(request.query.pageSize || 5);
    const page = Number(request.query.page  || 1);
    if (page <= 0 || pageSize <= 0) {
      response.status(400).json();
    }
    const data = await this.repository.findByUserId(request.user.id, page, pageSize);
    response.status(200).json(data);
  }
  
  async create(request: CustomRequest, response: Response, next: NextFunction) {
    const post = this.repository.create({...request.body, user: request.user.id});
    await this.repository.save(post);
    response.status(200).json(post);
  }
  
  async getListOther(request: CustomRequest, response: Response, next: NextFunction) {
    const pageSize = Number(request.query.pageSize || 5);
    const page = Number(request.query.page  || 1);
    if (page <= 0 || pageSize <= 0) {
      response.status(400).json();
    }
    const userId = Number(request.query.userId);
    const data = await this.repository.findByUserId(userId, page, pageSize);
    response.status(200).json(data);
  }
  
  async getDetailMine(request: CustomRequest, response: Response, next: NextFunction) {
    response.status(200).json();
  }
  
  async getDetailOther(request: CustomRequest, response: Response, next: NextFunction) {
    response.status(200).json();
  }
}