import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {Post} from "../../entity/blog/Post";
import {PageNumberPaginator, PaginationResponse} from "../../utils/paginator";
import {BlogRepository} from "./BlogRepository";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  private paginator = new PageNumberPaginator();
  async findByUserId(userId: number, page?: number, pageSize?: number): Promise<PaginationResponse<Post>> {
    let posts = await this.createQueryBuilder("post")
      .select(["post.title", "post.content", "post.user", "post.createdAt", "post.viewCount","post.isPrivate"])
      .where("post.user = :userId and post.isRemoved = false", {userId: userId})
      .orderBy('post.createdAt', 'DESC');
    return await this.paginator.paginate(posts, page, pageSize);
  }
}
