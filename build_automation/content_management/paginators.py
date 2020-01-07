from rest_framework.pagination import PageNumberPagination

class PageNumberSizePagination(PageNumberPagination):
    page_size = "10"
    page_size_query_param = "size"
    page_query_param = "page"
