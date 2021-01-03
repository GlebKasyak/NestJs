import { applyDecorators, UseGuards, HttpStatus } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse
} from "@nestjs/swagger";

import { PARAMS } from "../interfaces/enums";
import { AuthGuard } from "./auth.guard";
import { FullIdeaDTO } from "../idea/idea.dto";
import { UserDTO } from "../user/user.dto";
import { FullCommentDTO, CommentDTOWIthAuthor } from "../comment/comment.dto";

export const RequiredPaginationQueries = () =>
  applyDecorators(
    ApiQuery({ name: PARAMS.PAGE, required: false }),
    ApiQuery({ name: PARAMS.LIMIT, required: false })
  );

export const Auth = () => applyDecorators(ApiBearerAuth(), UseGuards(AuthGuard));

type CommonResponsePropsType = {
  resMessage: string;
  resStatus?: HttpStatus;
  resErrStatus?: HttpStatus;
  resIsArray?: boolean;
  dtoType:
    | typeof FullIdeaDTO
    | typeof UserDTO
    | typeof FullCommentDTO
    | typeof CommentDTOWIthAuthor;
  errorMessage?: string;
  secondErrMessage?: string;
};

// TODO: create 201 response
export const CommonResponseSwaggerDecorator = ({
  resMessage,
  resStatus = HttpStatus.OK,
  resErrStatus,
  resIsArray = false,
  dtoType,
  errorMessage = "Data doesn't found",
  secondErrMessage
}: CommonResponsePropsType) => {
  let successResponse;
  let errResponse;
  const errResponseData = { description: secondErrMessage };
  const successResponseData = {
    description: resMessage,
    type: dtoType,
    status: resStatus,
    isArray: resIsArray
  };

  switch (resStatus) {
    case HttpStatus.CREATED:
      successResponse = ApiCreatedResponse(successResponseData);
      break;
    default:
      successResponse = ApiOkResponse(successResponseData);
      break;
  }

  switch (resErrStatus) {
    case HttpStatus.UNAUTHORIZED:
      errResponse = ApiUnauthorizedResponse(errResponseData);
      break;
    default:
      errResponse = () => ({});
      break;
  }

  return applyDecorators(
    successResponse,
    ApiBadRequestResponse({ description: errorMessage }),
    errResponse,
    ApiInternalServerErrorResponse({ description: "internal server error" })
  );
};
