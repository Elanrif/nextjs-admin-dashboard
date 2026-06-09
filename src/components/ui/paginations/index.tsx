import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

// PAGINATION CLIENT SIDE (FRONTEND)
// À utiliser quand vous avez DÉJÀ TOUTES les données chargées en mémoire.
// La pagination se fait localement en découpant les données.
// Idéal pour petits volumes (< 5000 items).
interface PaginationWithTextProps {
  totalItems: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

// PAGINATION SERVER SIDE (BACKEND)
// À utiliser quand vous chargez les données PAGE PAR PAGE via une API.
// C'est le composant parent qui gère l'appel API et fournit currentPage et totalPages.
// Idéal pour gros volumes de données (API avec pagination).
interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function PaginationWithText({
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}: PaginationWithTextProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Restaurer la page depuis l'URL au chargement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");

    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setTimeout(() => {
          setCurrentPage(page);
        }, 0);
      }
    }
  }, [totalPages]);

  // Mettre à jour l'URL quand la page change
  const updateUrl = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    window.history.pushState({}, "", url.toString());
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;

    setCurrentPage(page);
    updateUrl(page);

    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: any = [];
    let l: any;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>

      <Pagination>
        <PaginationContent className="justify-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              showIcon={false}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>

          {getPageNumbers().map((page: any, index: any) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page as number);
                  }}
                  isActive={currentPage === page}
                  className={`p-5 border border-gray-300 ${
                    currentPage === page
                      ? "bg-brand-500 text-white hover:bg-brand-600 hover:text-white dark:bg-brand-600"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              showIcon={false}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function PaginationWithIcon({
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}: PaginationWithTextProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Restaurer la page depuis l'URL au chargement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");

    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setTimeout(() => {
          setCurrentPage(page);
        }, 0);
      }
    }
  }, [totalPages]);

  // Mettre à jour l'URL quand la page change
  const updateUrl = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    window.history.pushState({}, "", url.toString());
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;

    setCurrentPage(page);
    updateUrl(page);

    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: any = [];
    let l: any;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>

      <Pagination>
        <PaginationContent className="justify-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              showText={false}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>

          {getPageNumbers().map((page: any, index: any) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page as number);
                  }}
                  isActive={currentPage === page}
                  className={`p-5 border border-gray-300 ${
                    currentPage === page
                      ? "bg-brand-500 text-white hover:bg-brand-600 hover:text-white dark:bg-brand-600"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              showText={false}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function PaginationWithTextIcon({
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}: PaginationWithTextProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Restaurer la page depuis l'URL au chargement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");

    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setTimeout(() => {
          setCurrentPage(page);
        }, 0);
      }
    }
  }, [totalPages]);

  // Mettre à jour l'URL quand la page change
  const updateUrl = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    window.history.pushState({}, "", url.toString());
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;

    setCurrentPage(page);
    updateUrl(page);

    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: any = [];
    let l: any;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>

      <Pagination>
        <PaginationContent className="justify-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>

          {getPageNumbers().map((page: any, index: any) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page as number);
                  }}
                  isActive={currentPage === page}
                  className={`p-5 border border-gray-300 ${
                    currentPage === page
                      ? "bg-brand-500 text-white hover:bg-brand-600 hover:text-white dark:bg-brand-600"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: any = [];
    let l: any;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </div>

      <Pagination>
        <PaginationContent className="justify-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>

          {getPageNumbers().map((page: any, index: any) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page as number);
                  }}
                  isActive={currentPage === page}
                  className={`p-5 border border-gray-300 ${
                    currentPage === page
                      ? "bg-brand-500 text-white hover:bg-brand-600 hover:text-white dark:bg-brand-600"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export { PaginationWithText, PaginationWithIcon, PaginationWithTextIcon, PaginationControls };
