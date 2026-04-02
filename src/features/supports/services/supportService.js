import apiClient from '../../../core/network/ApiClient';
import { resolvePath } from '../../../core/network/utils/PathResolver';
import { API_PATH } from '../../../core/network/utils/ApiEndpoints';
import { PagedResponseModel } from '../../products/models/ProductModels';

// Matches backend SupportTicketDTO.MessageDTO
export class TicketMessageModel {
  constructor(data = {}) {
    this.messageId = data.messageId ?? null;
    this.senderUserId = data.senderUserId ?? null;
    this.senderName = data.senderName ?? '';
    this.senderType = data.senderType ?? 'CUSTOMER';
    this.messageText = data.messageText ?? '';
    this.createdAt = data.createdAt ?? null;
  }
}

// Matches backend SupportTicketDTO
export class SupportTicketModel {
  constructor(data = {}) {
    this.ticketId = data.ticketId ?? null;
    this.subject = data.subject ?? '';
    this.category = data.category ?? '';
    this.status = data.status ?? 'OPEN';
    this.priority = data.priority ?? 'LOW';
    this.orderId = data.orderId ?? null;
    this.createdByUserId = data.createdByUserId ?? null;
    this.createdByName = data.createdByName ?? '';
    this.assignedToUserId = data.assignedToUserId ?? null;
    this.assignedToName = data.assignedToName ?? null;
    this.messages = (data.messages ?? []).map((m) => new TicketMessageModel(m));
    this.createdAt = data.createdAt ?? null;
    this.updatedAt = data.updatedAt ?? null;
  }

  get statusColor() {
    const map = { OPEN: 'warning', IN_PROGRESS: 'info', RESOLVED: 'success', CLOSED: 'default' };
    return map[this.status] ?? 'default';
  }

  get priorityColor() {
    const map = { LOW: 'default', MEDIUM: 'warning', HIGH: 'error', URGENT: 'error' };
    return map[this.priority] ?? 'default';
  }
}

function _mapTickets(pagedData) {
  const paged = new PagedResponseModel(pagedData);
  paged.data = (pagedData.data ?? []).map((t) => new SupportTicketModel(t));
  return paged;
}

// ── Customer ──────────────────────────────────────────────────────────────────

function createTicket({ subject, message, category, orderId }) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.support.create);
  req.body = { subject, message, category, orderId };
  return req
    .then((res) => new SupportTicketModel(res.data))
    .catch((err) => Promise.reject(err));
}

function getMyTickets({ page = 0, size = 10 } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.support.my);
  req.query = { page, size };
  return req
    .then((res) => _mapTickets(res.data))
    .catch((err) => Promise.reject(err));
}

function getTicket(ticketId) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.support.detail, ticketId);
  return req
    .then((res) => new SupportTicketModel(res.data))
    .catch((err) => Promise.reject(err));
}

function replyToTicket(ticketId, message) {
  const req = apiClient.post();
  req.url = resolvePath(API_PATH.support.reply, ticketId);
  req.query = { message };
  return req
    .then((res) => new SupportTicketModel(res.data))
    .catch((err) => Promise.reject(err));
}

// ── Admin ─────────────────────────────────────────────────────────────────────

function getAdminTickets({ status, page = 0, size = 20 } = {}) {
  const req = apiClient.get();
  req.url = resolvePath(API_PATH.support.adminAll);
  req.query = { page, size, ...(status && { status }) };
  return req
    .then((res) => _mapTickets(res.data))
    .catch((err) => Promise.reject(err));
}

function updateTicketStatus(ticketId, status) {
  const req = apiClient.patch();
  req.url = resolvePath(API_PATH.support.adminUpdateStatus, ticketId);
  req.query = { status };
  return req
    .then((res) => new SupportTicketModel(res.data))
    .catch((err) => Promise.reject(err));
}

function assignTicket(ticketId) {
  const req = apiClient.patch();
  req.url = resolvePath(API_PATH.support.adminAssign, ticketId);
  return req
    .then((res) => new SupportTicketModel(res.data))
    .catch((err) => Promise.reject(err));
}

export const supportService = {
  createTicket, getMyTickets, getTicket, replyToTicket,
  getAdminTickets, updateTicketStatus, assignTicket,
};
