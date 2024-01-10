import signal, sys
from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

from functions.string_length import string_length
from functions.string_reverse import string_reverse
from functions.remove_imported_document import remove_imported_document
from functions.add_imported_document import add_imported_document
from functions.list_imported_documents import list_imported_documents
from functions.execute_query import execute_query

class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/RPC2',)


with SimpleXMLRPCServer(('0.0.0.0', 9000), allow_none=True, requestHandler=RequestHandler) as server:
    server.register_introspection_functions()


    def signal_handler(signum, frame):
        print("received signal")
        server.server_close()

        # perform clean up, etc. here...

        print("exiting, gracefully")
        sys.exit(0)


    # signals
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGHUP, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)

    # register both functions
    server.register_function(string_reverse)
    server.register_function(string_length)
    server.register_function(add_imported_document)
    server.register_function(remove_imported_document)
    server.register_function(list_imported_documents)
    server.register_function(execute_query)

    # start the server
    print("Starting the RPC Server...")
    server.serve_forever()
